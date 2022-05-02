import { Router } from "express";
import { postRegisterUserController, getUserController } from "../../../controllers";

const router = Router();

router.post("/", postRegisterUserController);
router.get("/", getUserController)

export = router;
