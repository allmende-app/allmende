import { Router } from "express";
import { getAPIController } from "../../controllers";
import predictRoute from "./predict";
import uploadRoute from "./upload";

const router = Router();

router.get("/", getAPIController);

router.use("/predict", predictRoute);
router.use("/upload", uploadRoute);

export = router;
