import fs from "fs";
import { Logger } from "../lib";
import { avatarURLs, downloadImage } from "../utils";
// import { Logger } from "../lib";

export const CONFIG = {
    port: process.env.PORT || 3000,
    secret:
        process.env.NODE_ENV !== "production"
            ? "allmende-secret"
            : process.env.SECRET,
};

export const initializeFolderAndSampleAvatars = async () => {
    if (!fs.existsSync(`${process.cwd()}/uploads`)) {
        Logger.info("Upload folder does not exist yet, create /uploads folder");
        fs.mkdirSync(`${process.cwd()}/uploads`);
        const downloadUrls = avatarURLs.map((url, i) =>
            downloadImage(url, `${process.cwd()}/uploads/random-${i}.jpg`),
        );
        await Promise.all(downloadUrls);
    }
};
