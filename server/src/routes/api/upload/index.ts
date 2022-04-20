import { Router } from "express";
import { getUploadController } from "../../../controllers";

const router = Router();

router.get("/", getUploadController);

export = router;
