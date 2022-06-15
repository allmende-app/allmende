import app from "./main";
import { CONFIG, initializeFolderAndSampleAvatars, connectDB, connectRedis } from "./config";
import { avatarURLs, downloadImage } from "./utils";
// import { Logger } from "./lib";

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
    } catch (e) {
        // Logger.error(e);
        console.error(e);
    }
});
