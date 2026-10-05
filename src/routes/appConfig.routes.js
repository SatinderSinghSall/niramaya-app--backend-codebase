import { Router } from "express";

import { checkAppUpdate } from "../controllers/appConfig.controller.js";

const router = Router();

router.get("/", checkAppUpdate);

export default router;
