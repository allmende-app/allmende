import { Request, Response } from "express";
import FormData from "form-data";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import { resolveToImageBuffer } from "../utils";
import { checkValidKingdomType } from "../utils/check";
import { Species } from "../models";
import { ErrorMessages } from "../messages";
import { Logger } from "../lib";

export class PredictController {
    static async getPredictions(req: Request, res: Response) {
        try {
            if (req.session.user) {
                const types: string[] = req.body.types;
                if (!checkValidKingdomType(types))
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        getPredictionsErr: {
                            kingdomType: ErrorMessages.INVALID_KINGDOM,
                        },
                    });
                const images = req.files as Express.Multer.File[];
                if (
                    (!Array.isArray(types) && images.length > 1) ||
                    (Array.isArray(types) && types.length !== images.length)
                ) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        getPredictionsErr: {
                            countMismatch: ErrorMessages.COUNT_MISMATCH,
                        },
                    });
                }
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
                        if (Array.isArray(types)) {
                            formData.append("kingdom", types[i]);
                        } else {
                            formData.append("kingdom", types);
                        }
                        const opt = {
                            method: "post",
                            data: formData,
                            url: process.env.NODE_ENV !== "production" ? "http://localhost:5000/scan" : process.env.ML_URL + ':5000/scan',
                            headers: {
                                ...formData.getHeaders(),
                            },
                        };
                        return axios(opt);
                    });

                    const results = await Promise.all(requests);
                    const predictions = results.map((r) => {
                        if (r.status !== 200) {
                            throw Error(ErrorMessages.PREDICTION_ERROR);
                        }

                        return {
                            predictions: [
                                {
                                    id: r.data.class1,
                                    score: r.data.probability1,
                                },
                                {
                                    id: r.data.class2,
                                    score: r.data.probability2,
                                },
                                {
                                    id: r.data.class3,
                                    score: r.data.probability3,
                                },
                                {
                                    id: r.data.class4,
                                    score: r.data.probability4,
                                },
                                {
                                    id: r.data.class5,
                                    score: r.data.probability5,
                                },
                            ],
                        };
                    });

                    const pendingSpeciesRequests = predictions.map((p) => {
                        return Promise.all([
                            Species.findBySpeciesID(p.predictions[0].id),
                            Species.findBySpeciesID(p.predictions[1].id),
                            Species.findBySpeciesID(p.predictions[2].id),
                            Species.findBySpeciesID(p.predictions[3].id),
                            Species.findBySpeciesID(p.predictions[4].id),
                        ]);
                    });

                    const resultingSpecies = await Promise.all(
                        pendingSpeciesRequests,
                    );

                    const returnedPredictions = images.map((img, i) => {
                        const species = resultingSpecies[i];
                        const predictionForFile = predictions[i];
                        const fileInfo = {
                            originalname: img.originalname,
                            mimetype: img.mimetype,
                            fieldname: img.fieldname,
                            result: [
                                {
                                    ...predictionForFile.predictions[0],
                                    species: species[0],
                                },
                                {
                                    ...predictionForFile.predictions[1],
                                    species: species[1],
                                },
                                {
                                    ...predictionForFile.predictions[2],
                                    species: species[2],
                                },
                                {
                                    ...predictionForFile.predictions[3],
                                    species: species[3],
                                },
                                {
                                    ...predictionForFile.predictions[4],
                                    species: species[4],
                                },
                            ],
                        };
                        return fileInfo;
                    });
                    return res.status(StatusCodes.OK).json({
                        predictions: returnedPredictions,
                    });
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        getPredictionsErr: {
                            noImages: ErrorMessages.NO_IMAGES,
                        },
                    });
                }
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    getPredictionsErr: {
                        error: ErrorMessages.NOT_REGISTERED,
                    },
                });
            }
        } catch (e: any) {
            Logger.error(e);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                getPredictionsErr: {
                    error: e.toString(),
                },
            });
        }
    }
}
