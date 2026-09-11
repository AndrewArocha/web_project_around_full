// Main router for app

import { Router } from "express";
import userRouter from "./users.js";
import cardRouter from "./cards.js";

const router = Router();

router.use("/users", userRouter);
router.use("/cards", cardRouter);

export default router;