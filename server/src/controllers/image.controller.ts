import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import fs from "fs";
import { checkIfImage } from "../utils";

export class ImageController {
    static async getImageController(req: Request, res: Response) {
        if (req.params.file) {
            const { file } = req.params;
            if (!checkIfImage(file.toLowerCase()))
                return res.status(StatusCodes.BAD_REQUEST).send("Not a image");
            if (fs.existsSync(path.join(process.cwd(), "/uploads", file))) {
                return res
                    .status(StatusCodes.OK)
                    .sendFile(path.join(process.cwd(), "/uploads", file));
            }
            return res.status(StatusCodes.NOT_FOUND).send("File not found");
        }
        return res.status(StatusCodes.BAD_REQUEST).send("Missing file");
    }
}
