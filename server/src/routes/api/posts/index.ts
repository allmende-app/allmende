import { Router } from "express";
import { PostsController } from "../../../controllers";
import { upload } from "../../../middlewares";

const router = Router();

router.post("/", upload.any(), PostsController.createPostController);
router.get("/", PostsController.getPostsController);
router.get("/:id", PostsController.getPostByIDController);
// router.put("/:id", PostsController.editPostByIDController);

export = router;
