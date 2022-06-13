import fs from "fs";
import { avatarURLs, download_image } from "../utils";
// import { Logger } from "../lib";

export const CONFIG = {
    port: process.env.PORT || 3000,
    secret:
        process.env.NODE_ENV !== "production"
            ? "allmende-secret"
            : process.env.SECRET,
};

export const initializeFolders = async () => {
    if (!fs.existsSync(`${process.cwd()}/uploads`)) {
        console.log("Upload folder does not exist yet, create /uploads folder");
        fs.mkdirSync(`${process.cwd()}/uploads`);
        const downloadUrls = avatarURLs.map((url, i) =>
            download_image(url, `${process.cwd()}/uploads/random-${i}.jpg`),
        );
        await Promise.all(downloadUrls);
    }
};
