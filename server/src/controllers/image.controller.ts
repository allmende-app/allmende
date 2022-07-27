import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import fs from "fs";
import { checkIfImage } from "../utils";
import sharp from "sharp";
import { Logger } from "../lib";

export class ImageController {
    static async getImageController(req: Request, res: Response) {
        if (req.params.file) {
            try {
                const { file } = req.params;
                if (!checkIfImage(file.toLowerCase()))
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .send("Not a image");
                if (fs.existsSync(path.join(process.cwd(), "/uploads", file))) {
                    const buffer = fs.readFileSync(path.join(process.cwd(), "uploads", file));
                    const exif = await sharp(buffer).metadata();

                    const { width, height } = exif;
                    if (width && height && width / height > 1.6) {
                        let type = "";
                        if (file.toLowerCase().includes("jpeg")) type = "jpeg";
                        if (file.toLowerCase().includes("jpg")) type = "jpg";
                        if (file.toLowerCase().includes("png")) type = "png";
                        const newBuffer = await sharp(buffer).png({
                            force: false,
                        }).jpeg({
                            force: false,
                        }).withMetadata({
                            orientation: 1,
                        })
                            .toBuffer();
                        return res.type(type).send(newBuffer);
                    }

                    return res
                        .status(StatusCodes.OK)
                        .sendFile(path.join(process.cwd(), "/uploads", file));
                }
                return res.status(StatusCodes.NOT_FOUND).send("File not found");
            } catch (e) {
                Logger.error(e);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
            }
        }
        return res.status(StatusCodes.BAD_REQUEST).send("Missing file");
    }
}
