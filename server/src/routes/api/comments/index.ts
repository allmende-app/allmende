import { Router } from "express";
import { CommentsController } from "../../../controllers";

const router = Router();

router.post("/", CommentsController.createCommentController);
router.get("/:id", CommentsController.getCommentsByPostIDController);
router.delete("/:id", CommentsController.deleteCommentController);
router.put("/:id", CommentsController.editCommentController);

export = router;
