import { Router } from "express";
import { CommentsController } from "../../../controllers";

const router = Router();

router.post("/:id", CommentsController.createCommentController);
router.get("/comment/:id", CommentsController.getCommentByIDController);
router.get("/:id", CommentsController.getCommentsByPostIDController);
router.delete("/:id", CommentsController.deleteCommentController);
router.put("/:id", CommentsController.editCommentController);

export = router;
