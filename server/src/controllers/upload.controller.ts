import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { spawn } from 'child_process';
import { Logger } from "../lib";

const predictImageWithPython = (fileName: string) => {
  const thread = spawn(`${process.env.PWD}/venv/bin/python3`, [`${process.env.PWD}/python/main.py`, fileName]);

  return new Promise<Buffer>((resolve, reject) => {
    thread.stdout.on("data", (data: Buffer) => {
      resolve(data);
    });
    thread.stderr.on("data", (data: Buffer) => {
      reject(data);
    });
  });
}

export const getUploadController = async (req: Request, res: Response) => {
  if (req.file) {
    try {
      const output = await predictImageWithPython(req.file.filename);
      const classification = Buffer.from(output).toString();
      Logger.info(classification);
      res.status(StatusCodes.ACCEPTED).json({ fileName: req.file.filename, classification: classification });
    } catch (error) {
      Logger.error(error);
    }
  } else {
    res.status(StatusCodes.NOT_ACCEPTABLE).send("Not acceptable");
  }
};
