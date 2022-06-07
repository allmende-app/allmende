import { Request, Response } from "express";
import FormData from "form-data";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import { resolveToImageBuffer } from "../utils";
import { checkValidKingdomType } from "../utils/check";

export class PredictController {
    static async getPredictions(req: Request, res: Response) {
        try {
            if (req.session.user) {
                const types: string[] = req.body.types;
                if (!checkValidKingdomType(types))
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .send("Invalid kingdom types");
                const images = req.files as Express.Multer.File[];
                if (images && images.length > 0) {
                    const requests = images.map(async (img, i) => {
                        const formData = new FormData();
                        const newBuffer = await resolveToImageBuffer(
                            img.buffer,
                        );

                        formData.append("file", newBuffer, {
                            contentType: img.mimetype,
                            filename: img.originalname,
                        });
                        formData.append("kingdom", types[i]);
                        const opt = {
                            method: "post",
                            data: formData,
                            url: "http://localhost:5000/scan",
                            headers: {
                                ...formData.getHeaders(),
                            },
                        };
                        return axios(opt);
                    });

                    const results = await Promise.all(requests);
                    const predictions = results.map((r) => {
                        if (r.status !== 200)
                            throw new Error("Prediction Error - 500");
                        return {
                            predictions: [
                                {
                                    id: r.data.class1,
                                    score: r.data.propability1,
                                },
                                {
                                    id: r.data.class2,
                                    score: r.data.propability2,
                                },
                                {
                                    id: r.data.class3,
                                    score: r.data.propability3,
                                },
                            ],
                        };
                    });

                    const gbifRequests = predictions.map((p) => {
                        return Promise.all([
                            axios.get(
                                `https://api.gbif.org/v1/species/${p.predictions[0].id}`,
                            ),
                            axios.get(
                                `https://api.gbif.org/v1/species/${p.predictions[1].id}`,
                            ),
                            axios.get(
                                `https://api.gbif.org/v1/species/${p.predictions[2].id}`,
                            ),
                        ]);
                    });

                    const gbifResponses = await Promise.all(gbifRequests);

                    const returnedPredictions = images.map((img, i) => {
                        const gbif = gbifResponses[i];
                        const predictionForFile = predictions[i];
                        const fileInfo = {
                            originalname: img.originalname,
                            mimetype: img.mimetype,
                            fieldname: img.fieldname,
                            result: [
                                {
                                    ...predictionForFile.predictions[0],
                                    ...gbif[0].data,
                                },
                                {
                                    ...predictionForFile.predictions[1],
                                    ...gbif[1].data,
                                },
                                {
                                    ...predictionForFile.predictions[2],
                                    ...gbif[2].data,
                                },
                            ],
                        };
                        return fileInfo;
                    });
                    return res.status(StatusCodes.OK).json({
                        predictions: returnedPredictions,
                    });
                } else {
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .send("No images attached");
                }
            } else {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .send("Not logged in or registered");
            }
        } catch (e) {
            console.error(e);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        }
    }
}
