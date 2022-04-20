import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const getAPIController = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("From API Controller");
};
