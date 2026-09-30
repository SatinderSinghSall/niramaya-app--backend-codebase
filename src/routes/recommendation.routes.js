import express from "express";

import { getUserRecommendations } from "../controllers/recommendation.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getUserRecommendations);

export default router;
