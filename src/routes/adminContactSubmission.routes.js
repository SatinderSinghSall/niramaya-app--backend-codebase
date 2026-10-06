import express from "express";

import {
  getAdminContactSubmissionsController,
  getAdminContactSubmissionController,
  updateAdminContactSubmissionController,
  getAdminContactSubmissionCountsController,
} from "../controllers/admin/adminContactSubmission.controller.js";

import {
  authenticateAdmin,
  requireAdminRole,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Contact submissions are restricted to Super Admins.
router.use(authenticateAdmin);
router.use(requireAdminRole("super_admin"));

router.get("/", getAdminContactSubmissionsController);

router.get("/counts", getAdminContactSubmissionCountsController);

router.get("/:id", getAdminContactSubmissionController);

router.patch("/:id", updateAdminContactSubmissionController);

export default router;
