import { Router } from "express";
import {
  listAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin,
  getAdminRoles,
} from "../controllers/admin/adminManagement.controller.js";
import {
  authenticateAdmin,
  requireAdminRole,
} from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/roles", requireAdminRole("super_admin", "admin"), getAdminRoles);
router.get("/", requireAdminRole("super_admin", "admin"), listAdmins);
router.get("/:id", requireAdminRole("super_admin", "admin"), getAdmin);

router.post("/", requireAdminRole("super_admin", "admin"), createAdmin);
router.patch("/:id", requireAdminRole("super_admin", "admin"), updateAdmin);
router.patch(
  "/:id/status",
  requireAdminRole("super_admin", "admin"),
  updateAdminStatus,
);
router.delete("/:id", requireAdminRole("super_admin"), deleteAdmin);

export default router;
