import express from "express";

import { getDashboardData } from "../controllers/dashboard.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getDashboardData);

export default router;
