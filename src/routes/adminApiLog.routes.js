import express from "express";

import {
  getApiLog,
  getApiLogs,
  removeApiLog,
} from "../controllers/admin/adminApiLog.controller.js";

import {
  authenticateAdmin,
  requireAdminRole,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.use(authenticateAdmin);

/*
 * API logs can be viewed by administrators.
 */
router.get("/", requireAdminRole("super_admin", "admin"), getApiLogs);

/*
 * Get one API log in detail.
 */
router.get("/:id", requireAdminRole("super_admin", "admin"), getApiLog);

/*
 * Only super_admin can permanently delete API logs.
 */
router.delete("/:id", requireAdminRole("super_admin"), removeApiLog);

export default router;
