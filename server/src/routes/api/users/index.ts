import { Router } from "express";
import { UsersController } from "../../../controllers";

const router = Router();

router.post("/register", UsersController.registerController);
router.get("/", UsersController.getOwnProfileController);
router.get("/:username", UsersController.getProfileByUsernameController);
router.post("/login", UsersController.loginController);
router.delete("/logout", UsersController.logoutController);

export = router;
