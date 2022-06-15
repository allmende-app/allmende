import axios from "axios";
import fs from "fs";

export const avatarURLs = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Common_Blackbird.jpg/2880px-Common_Blackbird.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Taka_Shiba.jpg/800px-Taka_Shiba.jpg",
    "https://media.4-paws.org/5/4/4/c/544c2b2fd37541596134734c42bf77186f0df0ae/VIER%20PFOTEN_2017-10-20_164-3854x2667-1920x1329.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/aa/A._gigantea_Aldabra_Giant_Tortoise.jpg",
    // Random joke images :D
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/1920px-Donald_Trump_official_portrait.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Kanye_West_at_the_2009_Tribeca_Film_Festival_%28cropped%29.jpg/220px-Kanye_West_at_the_2009_Tribeca_Film_Festival_%28cropped%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Eminem_-_Concert_for_Valor_in_Washington%2C_D.C._Nov._11%2C_2014_%282%29_%28cropped%29.jpg/640px-Eminem_-_Concert_for_Valor_in_Washington%2C_D.C._Nov._11%2C_2014_%282%29_%28cropped%29.jpg",
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
