import { Router } from "express";
import { getAPIController } from "../../controllers";
import predictRoute from "./predict";
import uploadRoute from "./upload";
import usersRoute from "./users";

const router = Router();

router.get("/", getAPIController);

router.use("/predict", predictRoute);
router.use("/upload", uploadRoute);
router.use("/users", usersRoute);

export = router;
