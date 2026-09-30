import express from "express";

import {
  getAllYoga,
  getYogaById,
  getCategories,
  getFeatured,
  getPersonalizedRecommendations,
} from "../controllers/yoga.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllYoga);

router.get("/categories", getCategories);

router.get("/featured", getFeatured);

router.get("/recommendations", getPersonalizedRecommendations);

router.get("/:id", getYogaById);

export default router;
