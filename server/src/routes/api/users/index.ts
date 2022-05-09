import { Router } from "express";
import { postRegisterUserController, getUserController, postLoginUserController, logoutUserController, getUserByUsernameController } from "../../../controllers";

const router = Router();

router.post("/register", postRegisterUserController);
router.get("/", getUserController);
router.get("/:username", getUserByUsernameController);
router.post("/login", postLoginUserController);
router.delete("/logout", logoutUserController);

export = router;
