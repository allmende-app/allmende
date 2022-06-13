import app from "./main";
import { CONFIG, initializeFolders, connectDB, connectRedis } from "./config";
import { avatarURLs, download_image } from "./utils";
// import { Logger } from "./lib";

app.listen(CONFIG.port, async () => {
    const downloadUrls = avatarURLs.map((url, i) =>
        download_image(url, `${process.cwd()}/uploads/random-${i}.jpg`),
    );
    await Promise.all(downloadUrls);
    try {
        const res = await connectDB();
        const redisClient = connectRedis();
        await redisClient
            .connect()
            .then(() => console.log("Connected to Redis DB client"))
            .catch(console.error);
        // Logger.info("Connected to Redis DB client");
        initializeFolders();
        console.log(`Connected to DB: "${res.connections[0].name}"`);
        console.log(`Server listening on PORT: ${CONFIG.port}`);
    } catch (e) {
        // Logger.error(e);
        console.error(e);
    }
});
