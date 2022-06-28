import app from "./main";
import {
    CONFIG,
    initializeFolderAndSampleAvatars,
    connectDB,
    connectRedis,
    fetchGBIFData,
    insertSpeciesEntriesIntoDB,
} from "./config";
import { readIDsOfCSV } from "./config/";
import fs from "fs";
import path from "path";


app.listen(CONFIG.port, async () => {
    try {
        const res = await connectDB();
        const redisClient = connectRedis();
        await redisClient
            .connect()
            .then(() => console.log("Connected to Redis DB client"))
            .catch(console.error);
        // Logger.info("Connected to Redis DB client");
        await initializeFolderAndSampleAvatars();
        console.log(`Connected to DB: "${res.connections[0].name}"`);
        console.log(`Server listening on PORT: ${CONFIG.port}`);

        const unresolved: Promise<string[]>[] = [];

        const files = fs.readdirSync(path.join(process.cwd(), "resources"));

        const foo = files.map(file => {
            return new Promise<string[]>((resolve) => {
                resolve(readIDsOfCSV(file));
            })
        })

        const bar: (string[])[] = await Promise.all(foo);

        const resolvedIds = await Promise.all(unresolved);
        const ids: string[] = [];
        bar.forEach(arr => ids.concat(arr))
        // const ids = await readIDsOfCSV("species.csv");
        const species = await fetchGBIFData(ids);
        if (species) {
            const documents = await insertSpeciesEntriesIntoDB(species);
        }
    } catch (e) {
        // Logger.error(e);
        console.error(e);
    }
});
