import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const getUploadController = (req: Request, res: Response) => {
  if (req.file) {
    res.status(StatusCodes.ACCEPTED).json({ fileName: req.file.filename });
  } else {
    res.status(StatusCodes.NOT_ACCEPTABLE).send("Not acceptable");
  }
};
