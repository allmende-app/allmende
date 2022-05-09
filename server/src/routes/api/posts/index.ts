import { Router } from "express";
import { postCreatePostController, getPostByIDController, getPostsController } from "../../../controllers";
import { upload } from "../../../middlewares";

const router = Router();

router.post("/", upload.any(), postCreatePostController);
router.get("/", getPostsController);
router.get("/:id", getPostByIDController);

export = router;
