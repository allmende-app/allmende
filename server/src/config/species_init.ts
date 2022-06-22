import fs from "fs";
import path from "path";
import csv from "csv-parser";
import axios from "axios";
import { GBIFInfo, GBIFMedia } from "../interfaces";
import { ISpecies, ISpeciesDocument, Species } from "../models";

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
        return entries.filter((entry) => entry !== null);
    } catch (e) {
        console.error(e);
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
                                        console.log(_);
                                        resolve(_);
                                    });
                                });
                            } else {
                                console.log(
                                    `Species ->'${entry.key}' -- '${
                                        entry.vernacularName ||
                                        entry.canonicalName ||
                                        entry.scientificName
                                    }' already exists`,
                                );
                            }
                        } else {
                            console.log("Entry is null");
                        }
                    }),
            ),
        );

        return results;
    } catch (e) {
        console.error(e);
    }
};
