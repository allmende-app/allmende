import { Router } from "express";
import usersRoute from "./users";
import postsRoute from "./posts";
import commentsRoute from "./comments";
import imageRoute from "./image";
import predictionRoute from "./predict";
import sightingsRoute from "./sightings";
import speciesRoute from "./species";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.use("/users", usersRoute);
router.use("/posts", postsRoute);
router.use("/comments", commentsRoute);
router.use("/image", imageRoute);
router.use("/predict", predictionRoute);
router.use("/sightings", sightingsRoute);
router.use("/species", speciesRoute);

router.get("/ping", (req, res) => {
    res.status(StatusCodes.OK).json({
        nguyen: "dahyun",
        nature: "allmende",
        foo: 42,
    });
});

export = router;
