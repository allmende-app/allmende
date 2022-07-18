import app from "./main";
import {
    CONFIG,
    initializeFolderAndSampleAvatars,
    connectDB,
    connectRedis,
    insertSpeciesJob,
    fixImageUrlOfProfiles,
    initializeLocations,
} from "./config";
import { Logger } from "./lib";

app.listen(CONFIG.port, async () => {
    try {
        const res = await connectDB();
        const redisClient = connectRedis();
        await redisClient
            .connect()
            .then(() => Logger.info("Connected to Redis DB client"))
            .catch(Logger.error);
        await initializeFolderAndSampleAvatars();
        await fixImageUrlOfProfiles();
        const done = await insertSpeciesJob();
        await initializeLocations();
        if (done) Logger.info(`Script for inserting species -> DONE.`);
        Logger.info(`Connected to DB: "${res.connections[0].name}"`);
        Logger.info(`Server listening on PORT: ${CONFIG.port}`);
    } catch (e) {
        Logger.error(e);
    }
});
