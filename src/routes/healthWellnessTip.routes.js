import express from "express";

import {
  getActiveHealthWellnessTipController,
  getActiveHealthWellnessTipsController,
  getFeaturedHealthWellnessTipsController,
} from "../controllers/healthWellnessTip.controller.js";

const router = express.Router();

router.get("/", getActiveHealthWellnessTipsController);

router.get("/featured", getFeaturedHealthWellnessTipsController);

router.get("/:id", getActiveHealthWellnessTipController);

export default router;
