import express from "express";

import {
  createHealthWellnessTipController,
  deleteHealthWellnessTipController,
  getHealthWellnessTipController,
  getHealthWellnessTipsController,
  updateHealthWellnessTipController,
} from "../controllers/admin/adminHealthWellnessTip.controller.js";

import {
  authenticateAdmin,
  requireAdminRole,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.use(authenticateAdmin, requireAdminRole("super_admin"));

router.get("/", getHealthWellnessTipsController);

router.get("/:id", getHealthWellnessTipController);

router.post("/", createHealthWellnessTipController);

router.put("/:id", updateHealthWellnessTipController);

router.delete("/:id", deleteHealthWellnessTipController);

export default router;
