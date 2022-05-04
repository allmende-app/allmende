import { Router } from "express";
import { postRegisterUserController, getUserController, postLoginUserController, logoutUserController } from "../../../controllers";

const router = Router();

router.post("/register", postRegisterUserController);
router.get("/", getUserController);
router.post("/login", postLoginUserController);
router.delete("/logout", logoutUserController);

export = router;
