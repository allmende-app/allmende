import { Router } from "express";
import apiRoute from "./api";

const router = Router();

router.use("/api", apiRoute);

export = router;
