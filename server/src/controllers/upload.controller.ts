import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const getUploadController = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("From Upload Controller");
};
