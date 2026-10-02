import express from "express";

import {
  getAllYoga,
  getYogaById,
  incrementViewCount,
  getCategories,
  getFeatured,
  getPersonalizedRecommendations,
  proxyYogaImage,
} from "../controllers/yoga.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ─────────────────────────
// PUBLIC IMAGE PROXY
// Must be BEFORE authenticate
// because React Native Image does not send JWT headers
// ─────────────────────────
router.get("/image", proxyYogaImage);

// ─────────────────────────
// PROTECTED YOGA API
// ─────────────────────────
router.use(authenticate);

router.get("/", getAllYoga);

router.get("/categories", getCategories);

router.get("/featured", getFeatured);

router.get("/recommendations", getPersonalizedRecommendations);

router.post("/:id/view", incrementViewCount);

router.get("/:id", getYogaById);

export default router;
