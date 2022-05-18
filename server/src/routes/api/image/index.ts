import { Router } from "express";
import { ImageController } from "../../../controllers";

const router = Router();

router.get("/:file", ImageController.getImageController);

export = router;
