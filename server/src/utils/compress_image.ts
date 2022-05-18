import sharp from "sharp";
import fs from "fs";
import p from "path";

export function compressImage(file: Express.Multer.File) {
    const { path, filename, } = file;
    sharp(path)
        .jpeg({
            force: false,
            quality: 30,
        })
        .png({
            force: false,
            quality: 40,
        })
        .webp({
            force: false,
            quality: 40,
        })
        .toBuffer((err, buffer) => {
            if (err) {
                console.error(err);
                throw err;
            }
            fs.writeFile(p.join(process.cwd(), "/uploads", filename), buffer, (e) => {
                if (e) {
                    console.error(e);
                    throw e;
                }
            });
        });
}