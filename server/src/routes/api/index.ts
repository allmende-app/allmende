import { Router } from "express";
import usersRoute from "./users";
import postsRoute from "./posts";
import commentsRoute from "./comments";
import imageRoute from "./image";

const router = Router();

router.use("/users", usersRoute);
router.use("/posts", postsRoute);
router.use("/comments", commentsRoute);
router.use("/image", imageRoute);

export = router;
