import { Request, Response } from "express";
import FormData from "form-data";
import { StatusCodes } from "http-status-codes";
import axios from "axios";

export class PredictControlller {
    static async getPredictions(req: Request, res: Response) {
        try {
            if (req.session.user) {
                const images = req.files as Express.Multer.File[];
                if (images && images.length > 0) {
                    const requests = images.map(img => {
                        const formData = new FormData();
                        formData.append("file", img.buffer, {
                            contentType: img.mimetype,
                            filename: img.originalname,
                        });
                        const opt = {
                            method: "get",
                            body: formData,
                            url: "http://127.0.0.1:5000/predict",
                            headers: {
                                ...formData.getHeaders()
                            }
                        }
                        return axios(opt);
                    });
    
                    const results = await Promise.all(requests);
                    console.log(results)
                    return res.status(StatusCodes.OK).json({
                        predictions: [],
                    });
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).send("No images attached");
                }
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).send("Not logged in or registered");
            }
        } catch (e) {
            console.error(e);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error")
        }
    }
}