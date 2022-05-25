import { Request, Response } from "express";
import FormData from "form-data";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import {resolveToFileInfoOutput, resolveToImageBuffer} from "../utils";
import path from "path";
import fs from "fs";

export class PredictController {
    static async getPredictions(req: Request, res: Response) {
        try {
            if (req.session.user) {
                const images = req.files as Express.Multer.File[];
                if (images && images.length > 0) {
                    const requests = images.map(async img => {
                        const formData = new FormData();
                        const newBuffer = await resolveToImageBuffer(img.buffer)

                        formData.append("file", newBuffer, {
                            contentType: img.mimetype,
                            filename: img.originalname,
                        });
                        const opt = {
                            method: "post",
                            data: formData,
                            url: "http://localhost:5000/scan",
                            headers: {
                                ...formData.getHeaders(),
                            },
                        }
                        return axios(opt);
                    });

                    const results = await Promise.all(requests);
                    const predictions = results.map(r => {
                        if (r.status !== 200) throw new Error("Prediction Error - 500");
                        return r.data.predictions;
                    });
                    const returnedPredictions = images.map((img, i) => {
                        const predictionForFile = predictions[i];
                        const fileInfo = {
                            originalname: img.originalname,
                            mimetype: img.mimetype,
                            fieldname: img.fieldname,
                            result: predictionForFile,
                        }
                        return fileInfo;
                    });
                    return res.status(StatusCodes.OK).json({
                        predictions: returnedPredictions,
                    });
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).send("No images attached");
                }
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).send("Not logged in or registered");
            }
        } catch (e) {
            console.error(e);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        }
    }
}
