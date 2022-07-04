import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../lib";
import { ErrorMessages } from "../messages";
import { Species } from "../models";

export class SpeciesController {
    static async getSpeciesByID(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const id = req.params;
                if (!id) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        getSpeciesByErr: {
                            idErr: ErrorMessages.NO_SPECIES_ID,
                        },
                    });
                }
                if (id instanceof String) {
                    const species = await Species.findById(id);
                    return res.status(StatusCodes.OK).json({
                        species: species,
                    });
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        getSpeciesByErr: {
                            idErr: ErrorMessages.NOT_VALID_SPECIES_ID,
                        },
                    });
                }
            } catch (e: any) {
                Logger.error(e.toString());
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    getSpeciesByIDErr: {
                        error: e.toString(),
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                getSpeciesByErr: {
                    error: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }

    static async searchSpecies(req: Request, res: Response) {
        if (req.session.user) {
            try {
                const q = req.query.q;
                if (!q) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        searchSpeciesErr: {
                            queryError: ErrorMessages.NO_SEARCH_QUERY,
                        },
                    });
                }
                if (q instanceof String) {
                    const entries = await Species.find({
                        vernacularName: {
                            "$regex": q,
                            "$options": "i"
                        }
                    });
                    return res.status(StatusCodes.OK).json({
                        species: entries,
                    });
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        searchSpeciesErr: {
                            queryError: ErrorMessages.NO_VALID_SEARCH,
                        },
                    });
                }
            } catch (e: any) {
                Logger.error(e.toString());
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    searchSpeciesErr: {
                        error: e.toString(),
                    },
                });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                searchSpeciesErr: {
                    error: ErrorMessages.NOT_REGISTERED,
                },
            });
        }
    }
}