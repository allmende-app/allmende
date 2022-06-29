import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../lib";
import { Sighting } from "../models";

export class SightingsController {
    static async getSightingByID(req: Request, res: Response) {
        if (req.session.user) {
            try {
                if (req.params.id) {
                    const id = req.params.id;
                    const sighting = await Sighting.findById(id);
                    if (!sighting) {
                        return res
                            .status(StatusCodes.NOT_FOUND)
                            .send("Sighting not found");
                    }
                    return res.status(StatusCodes.OK).json({
                        sighting: sighting,
                    });
                }
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send("No ID provided");
            } catch (e) {
                Logger.error(e);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
            }
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Not logged in or registered");
        }
    }
}
