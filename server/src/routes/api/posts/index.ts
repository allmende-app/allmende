import { Router } from "express";
import { createPostController, getPostByIDController, getPostsController } from "../../../controllers";
import { upload } from "../../../middlewares";

const router = Router();

router.post("/", upload.any(), createPostController);
router.get("/", getPostsController);
router.get("/:id", getPostByIDController);

export = router;
