import sharp from "sharp";
import fs from "fs";
import path from "path";
import { v4 as uuid4 } from "uuid";
import { Logger } from "../lib";

export interface ImageInfo extends sharp.OutputInfo {
    filename: string;
}

/**
 * Compresses the image, uses the multer middleware by default. Uploaded file be uploaded automatically.
 * @param file
 */
export function compressImage(file: Express.Multer.File) {
    const { path: p, filename } = file;
    sharp(p)
        .jpeg({
            force: false,
            quality: 15,
        })
        .png({
            force: false,
            quality: 15,
        })
        .webp({
            force: false,
            quality: 20,
        })
        .toBuffer((err, buffer) => {
            if (err) {
                Logger.error(err);
                throw err;
            }
            fs.writeFile(
                path.join(process.cwd(), "/uploads", filename),
                buffer,
                (e) => {
                    if (e) {
                        Logger.error(e);
                        throw e;
                    }
                },
            );
        });
}

/**
 * Returns a promise with the output info of the compressed image. Image will be stored on the machine.
 * @param buffer - Buffer
 * @param mimetype - Type of image
 */
export const resolveToFileInfoOutput = async (
    buffer: Buffer,
    mimetype: string,
) => {
    let type = "";
    const id = uuid4();
    if (mimetype.toLowerCase().includes("jpeg")) type = "jpeg";
    if (mimetype.toLowerCase().includes("jpg")) type = "jpg";
    if (mimetype.toLowerCase().includes("png")) type = "png";

    // eslint-disable-next-line @typescript-eslint/ban-types
    return new Promise<ImageInfo>((resolve, reject) => {
        sharp(buffer)
            .jpeg({
                force: false,
                quality: 15,
            })
            .png({
                force: false,
                quality: 15,
            })
            .webp({
                force: false,
                quality: 20,
            })
            .toFile(
                path.join(process.cwd(), "uploads", `${id}.${type}`),
                (err, info) => {
                    if (err) {
                        Logger.error(err);
                        reject(err);
                    }
                    const res = {
                        ...info,
                        filename: `${id}.${type}`,
                    };
                    resolve(res);
                },
            );
    });
};

/**
 * Returns a promise with the buffer. Compressed the image.
 * @param buffer
 */
export const resolveToImageBuffer = async (buffer: Buffer) => {
    return new Promise<Buffer>((resolve, reject) => {
        sharp(buffer)
            .jpeg({
                force: false,
                quality: 15,
            })
            .png({
                force: false,
                quality: 15,
            })
            .webp({
                force: false,
                quality: 15,
            })
            .toBuffer((err, newBuffer) => {
                if (err) {
                    Logger.error(err);
                    reject(err);
                }
                resolve(newBuffer);
            });
    });
};
