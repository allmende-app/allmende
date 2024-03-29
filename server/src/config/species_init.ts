import fs from "fs";
import path from "path";
import csv from "csv-parser";
import axios from "axios";
import { GBIFInfo, GBIFMedia } from "../interfaces";
import { ISpecies, ISpeciesDocument, Species } from "../models";
import pLimit from "p-limit";
import { Logger } from "../lib";

export const readIDsOfCSV = async (file: string) => {
    const promise = new Promise<{ ID: string }[]>((resolve) => {
        const results: { ID: string }[] = [];
        fs.createReadStream(path.join(process.cwd(), "resources", file))
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
                resolve(results);
            });
    });
    const result = await promise;
    return result.map((e) => e.ID);
};

export const readIDsFromDirectory = async (dir: string) => {
    const files = fs.readdirSync(path.join(process.cwd(), dir));
    const unresolved = files.map((file) => readIDsOfCSV(file));
    const promiseIds = await Promise.all(unresolved);

    const promise = new Promise<string[]>((resolve) => {
        const array: string[] = [];
        promiseIds.forEach((arr) => array.push(...arr));
        resolve(array);
    });
    const result = await promise;
    return result;
};

export const fetchGBIFData = async (ids: string[]) => {
    try {
        const header = {
            "Accept-Language": "de-DE,de",
        };
        const promises = ids.map(
            (id) =>
                new Promise<GBIFInfo | null>((resolve) =>
                    axios
                        .get<GBIFInfo>(
                            `https://api.gbif.org/v1/species/${id}`,
                            { headers: header },
                        )
                        .then((r) => resolve(r.data))
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .catch((e) => resolve(null)),
                ),
        );
        const mediaPromises = ids.map(
            (id) =>
                new Promise<GBIFMedia | null>((resolve) =>
                    axios
                        .get<GBIFMedia>(
                            `https://api.gbif.org/v1/species/${id}/media?limit=1`,
                        )
                        .then((r) => resolve(r.data))
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .catch((e) => resolve(null)),
                ),
        );
        const results = await Promise.all(promises);
        const imgs = await Promise.all(mediaPromises);

        const validData = {
            [1]: results.filter((r) => r !== null),
            [2]: imgs.filter((r) => r !== null),
        };

        const entries: (ISpecies | null)[] = validData[1].map(
            (entry, index) => {
                if (entry !== null) {
                    const media = validData[2][index];
                    if (media !== null) {
                        const img = media.results[0];
                        if (img) {
                            const { identifier } = img;
                            const newEntry = {
                                ...entry,
                                imageUrl: identifier,
                            };
                            return newEntry;
                        }
                        return {
                            ...entry,
                            imageUrl: "",
                        };
                    }
                }
                return null;
            },
        );
        const result = entries.filter((entry) => entry !== null);
        return result;
    } catch (e) {
        Logger.error(e);
    }
};

export const fetchAndInsert = async (ids: string[]) => {
    try {
        const species = await fetchGBIFData(ids);
        if (species && species.length > 0) {
            Logger.info(`-------- Inserting species DB --------`);
            insertSpeciesEntriesIntoDB(species);
        }
    } catch (e) {
        Logger.error(e);
    }
};

export const insertSpeciesEntriesIntoDB = async (
    species: (ISpecies | null)[],
) => {
    try {
        const alreadyExist = await Promise.all(
            species.map(
                (s) =>
                    new Promise<boolean>((resolve) => {
                        if (s)
                            Species.speciesExist(String(s.key)).then((valid) =>
                                resolve(valid),
                            );
                    }),
            ),
        );

        const results = await Promise.all(
            alreadyExist.map(
                (exist, index) =>
                    new Promise<ISpeciesDocument>((resolve) => {
                        const entry = species[index];
                        if (entry) {
                            if (!exist) {
                                const specieEntry = new Species();
                                specieEntry.key = entry.key;
                                specieEntry.vernacularName =
                                    entry.vernacularName || "";
                                specieEntry.imageUrl = entry.imageUrl || "";
                                specieEntry.construct(entry).then((d) => {
                                    d.save().then((_) => {
                                        Logger.info(
                                            `Species '${entry.key}' - '${entry.vernacularName}' is stored.`,
                                        );
                                        resolve(_);
                                    });
                                });
                            } else {
                                Logger.info(
                                    `Species ->'${entry.key}' -- '${
                                        entry.vernacularName ||
                                        entry.canonicalName ||
                                        entry.scientificName
                                    }' already exists`,
                                );
                            }
                        } else {
                            Logger.info("Entry is null");
                        }
                    }),
            ),
        );

        return results;
    } catch (e) {
        Logger.error(e);
    }
};

export const insertSpeciesJob = async () => {
    const limit = pLimit(4);
    const ids = await readIDsFromDirectory("resources");

    const copy = ids;
    const resolved = await Promise.all(
        copy.map(
            (id) =>
                new Promise<(ISpeciesDocument & { _id: any }) | null>(
                    (resolve) => {
                        Species.findOne({ key: id }).then((d) => resolve(d));
                    },
                ),
        ),
    );
    for (let i = 0; i < copy.length; i++) {
        const species = resolved[i];
        if (species !== null) {
            copy[i] = "-1";
        }
    }
    const uninsertedIds = copy.filter((id) => id !== "-1");

    let current = 1;
    const inputs = [];
    for (let i = 0; i < uninsertedIds.length; i += 20) {
        const curr = uninsertedIds.slice(i, i + 20);
        Logger.info(`-------- Synchronously doing step: ${current} --------`);
        current++;
        inputs.push(limit(() => fetchAndInsert(curr)));
    }
    const res = await Promise.all(inputs);
    return res;
};
