import { Router } from "express";
import { PredictControlller } from "../../../controllers/predict.controller";
import { upload } from "../../../middlewares";
import multer from "multer";

const router = Router();

router.get("/", multer().any() ,PredictControlller.getPredictions);

export = router;