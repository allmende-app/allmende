import { Router } from "express";
import { postRegisterUserController, getUserController, postLoginUserController } from "../../../controllers";

const router = Router();

router.post("/", postRegisterUserController);
router.get("/", getUserController);
router.post("/login", postLoginUserController);

export = router;
