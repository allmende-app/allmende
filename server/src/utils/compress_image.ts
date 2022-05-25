import sharp from "sharp";
import fs from "fs";
import path from "path";
import { v4 as uuid4 } from "uuid";

export interface ImageInfo extends sharp.OutputInfo {
    filename: string;
}

export function compressImage(file: Express.Multer.File) {
    const { path: p, filename } = file;
    sharp(p)
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
            fs.writeFile(
                path.join(process.cwd(), "/uploads", filename),
                buffer,
                (e) => {
                    if (e) {
                        console.error(e);
                        throw e;
                    }
                },
            );
        });
}

export const resolveToFileInfoOutput = async (buffer: Buffer, mimetype: string) => {
    let type = "";
    const id = uuid4();
    if (mimetype.toLowerCase().includes("jpeg"))
        type = "jpeg";
    if (mimetype.toLowerCase().includes("jpg"))
        type = "jpg";
    if (mimetype.toLowerCase().includes("png"))
        type = "png";

    // eslint-disable-next-line @typescript-eslint/ban-types
    return new Promise<ImageInfo>((resolve, reject) => {
        sharp(buffer)
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
            .toFile(path.join(process.cwd(), "uploads", `${id}.${type}`), (err, info) => {
                if (err) {
                    console.error(err)
                    reject(err);
                }
                console.log(info);
                const res = {
                    ...info,
                    filename: `${id}.${type}`
                }
                resolve(res);
            });
    })
}

export const resolveToImageBuffer = async (buffer: Buffer) => {
    return new Promise<Buffer>((resolve, reject) => {
        sharp(buffer)
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
            }).toBuffer((err, newBuffer) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(newBuffer);
            });
    });
}