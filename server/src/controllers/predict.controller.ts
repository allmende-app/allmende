import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const getPredictionController = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("From Prediction Controller");
};
