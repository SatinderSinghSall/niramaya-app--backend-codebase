import express from "express";

import {
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "../controllers/admin/adminMaintenance.controller.js";

import {
  authenticateAdmin,
  requireAdminRole,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

/*
 * Maintenance configuration is a
 * super-admin controlled system setting.
 */
router.use(authenticateAdmin);
router.use(requireAdminRole("super_admin"));

router.get("/", getMaintenance);

router.post("/", createMaintenance);

router.put("/", updateMaintenance);

router.delete("/", deleteMaintenance);

export default router;
