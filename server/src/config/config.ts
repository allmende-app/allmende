import fs from "fs";
import { Logger } from "../lib";

export const CONFIG = {
  port: process.env.PORT || 3000,
};

export const initializeFolders = () => {
  if (!fs.existsSync(`${process.env.PWD}/uploads`)) {
    Logger.info("Upload folder does not exists yet, create /uploads folder");
    fs.mkdirSync(`${process.env.PWD}/uploads`);
  }
};
