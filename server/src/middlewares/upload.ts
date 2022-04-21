import Multer from "multer";
import { v4 as uuid4 } from "uuid";

const storage = Multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.PWD + "/uploads");
  },
  filename: (req, file, cb) => {
    const fileName = uuid4();
    let fileType = "";
    if (file.mimetype.includes("png")) fileType = "png";
    if (file.mimetype.includes("jpeg")) fileType = "jpeg";
    if (file.mimetype.includes("jpg")) fileType = "jpg";
    cb(null, `${fileName}.${fileType}`);
  },
});

export const upload = Multer({ storage: storage });
