import axios from "axios";
import fs from "fs";

export const avatarURLs = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Common_Blackbird.jpg/2880px-Common_Blackbird.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Taka_Shiba.jpg/800px-Taka_Shiba.jpg",
];

export const downloadImage = (url: string, image_path: string) =>
    axios({
        url,
        responseType: "stream",
    }).then(
        (response) =>
            new Promise<void>((resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(image_path))
                    .on("finish", () => resolve())
                    .on("error", (e: Error) => reject(e));
            }),
    );
