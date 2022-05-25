import { Router } from "express";
import { PredictController } from "../../../controllers/predict.controller";
import { upload } from "../../../middlewares";
import multer from "multer";

const router = Router();

router.post("/", multer().any(), PredictController.getPredictions);

export = router;
