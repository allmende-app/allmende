import { Router } from "express";
import { getUploadController } from "../../../controllers";
import { upload } from "../../../middlewares";

const router = Router();

router.post("/", upload.single("image"), getUploadController);

export = router;
