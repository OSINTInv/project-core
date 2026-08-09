import { Router, type IRouter } from "express";
import healthRouter from "./health";
import resourcesRouter from "./resources";
import packsRouter from "./packs";
import profilesRouter from "./profiles";
import manifestsRouter from "./manifests";
import communityRouter from "./community";
import statsRouter from "./stats";
import downloadRouter from "./download";

const router: IRouter = Router();

router.use(healthRouter);
router.use(resourcesRouter);
router.use(packsRouter);
router.use(profilesRouter);
router.use(manifestsRouter);
router.use(communityRouter);
router.use(statsRouter);
router.use(downloadRouter);

export default router;
