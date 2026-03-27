import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import generateRouter from "./generate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(generateRouter);

export default router;
