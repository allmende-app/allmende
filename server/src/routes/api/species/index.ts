import { Router } from "express";
import { SpeciesController } from "../../../controllers";

const router = Router();

router.get("/:id", SpeciesController.getSpeciesByID);
router.get("/search", SpeciesController.searchSpecies);

export = router;
