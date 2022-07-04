import axios from "axios";
import fs from "fs";

export const avatarURLs = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Common_Blackbird.jpg/2880px-Common_Blackbird.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Taka_Shiba.jpg/800px-Taka_Shiba.jpg",
    "https://media.4-paws.org/5/4/4/c/544c2b2fd37541596134734c42bf77186f0df0ae/VIER%20PFOTEN_2017-10-20_164-3854x2667-1920x1329.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/aa/A._gigantea_Aldabra_Giant_Tortoise.jpg",
    "https://www.zoo-leipzig.de/fileadmin/_processed_/c/9/csm_Nepalesischer_Roter_Panda_2_96fa3e4c72.jpg",
    "https://www.tierpark-berlin.de/fileadmin/_processed_/0/7/csm_Jae_Jae_Cecile_Garans_252695cb69.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/0f/Grosser_Panda.JPG",
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
