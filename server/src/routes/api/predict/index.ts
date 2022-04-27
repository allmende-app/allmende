import { Router } from "express";
import { getPredictionController } from "../../../controllers";

const router = Router();

router.get("/", getPredictionController);

export = router;
