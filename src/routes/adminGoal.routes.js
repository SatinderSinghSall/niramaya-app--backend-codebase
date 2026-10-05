import { Router } from "express";
import {
  authenticateAdmin,
  requireAdminRole,
} from "../middlewares/adminAuth.middleware.js";
import {
  list,
  stats,
  getOne,
  updateStatus,
  updateProgress,
} from "../controllers/admin/adminGoal.controller.js";

const router = Router();
router.use(authenticateAdmin);
router.get("/", requireAdminRole("super_admin", "admin", "support"), list);
router.get(
  "/stats",
  requireAdminRole("super_admin", "admin", "support"),
  stats,
);
router.get("/:id", requireAdminRole("super_admin", "admin", "support"), getOne);
router.patch(
  "/:id/status",
  requireAdminRole("super_admin", "admin"),
  updateStatus,
);
router.patch(
  "/:id/progress",
  requireAdminRole("super_admin", "admin"),
  updateProgress,
);
export default router;
