import { Router } from "express";
import { SightingsController } from "../../../controllers";

const router = Router();

router.get("/:id", SightingsController.getSightingByID);

export = router;
