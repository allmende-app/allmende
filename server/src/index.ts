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

        const ids = await readIDsOfCSV("species.csv");
        const species = await fetchGBIFData(ids);
        if (species) {
            const documents = await insertSpeciesEntriesIntoDB(species);
        }
    } catch (e) {
        // Logger.error(e);
        console.error(e);
    }
});
