import express from "express";

import {
  getAllAyurveda,
  getAyurvedaById,
  getCategories,
  getFeatured,
  getPersonalizedRecommendations,
} from "../controllers/ayurveda.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllAyurveda);

router.get("/categories", getCategories);

router.get("/featured", getFeatured);

router.get("/recommendations", getPersonalizedRecommendations);

router.get("/:id", getAyurvedaById);

export default router;
