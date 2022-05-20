import { Router } from "express";
import { UsersController } from "../../../controllers";
import { upload } from "../../../middlewares";

const router = Router();

router.post("/register", UsersController.registerController);
router.get("/", UsersController.getOwnProfileController);
router.get("/:username", UsersController.getProfileByUsernameController);
router.post("/login", UsersController.loginController);
router.delete("/logout", UsersController.logoutController);
router.put("/follow/:username", UsersController.followUserController);
router.delete("/unfollow/:username", UsersController.unfollowUserController);
router.delete(
    "/remove/:username",
    UsersController.removeFollowedUserController,
);
router.put(
    "/changeAvatar",
    upload.single("avatar"),
    UsersController.uploadAvatar,
);

export = router;
