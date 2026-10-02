import express from "express";

import {
  getAllAyurveda,
  getAyurvedaById,
  getCategories,
  getFeatured,
  getPersonalizedRecommendations,
  incrementViewCount,
} from "../controllers/ayurveda.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

// ------------------------------------------------------------
// Ayurveda listing
// ------------------------------------------------------------

router.get("/", getAllAyurveda);

// ------------------------------------------------------------
// Categories
// ------------------------------------------------------------

router.get("/categories", getCategories);

// ------------------------------------------------------------
// Featured Ayurveda
// ------------------------------------------------------------

router.get("/featured", getFeatured);

// ------------------------------------------------------------
// Personalized recommendations
// ------------------------------------------------------------

router.get("/recommendations", getPersonalizedRecommendations);

// ------------------------------------------------------------
// View tracking
// IMPORTANT: keep this before /:id
// ------------------------------------------------------------

router.post("/:id/view", incrementViewCount);

// ------------------------------------------------------------
// Single Ayurveda item
// ------------------------------------------------------------

router.get("/:id", getAyurvedaById);

export default router;
