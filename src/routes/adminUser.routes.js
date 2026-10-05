import { Router } from "express";
import {
  listUsers,
  getUser,
  getUserDetails,
  updateUserStatus,
  deleteUser,
} from "../controllers/admin/adminUser.controller.js";
import {
  authenticateAdmin,
  requireAdminRole,
} from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", requireAdminRole("super_admin", "admin", "support"), listUsers);
router.get(
  "/:id",
  requireAdminRole("super_admin", "admin", "support"),
  getUser,
);
router.get(
  "/:id/details",
  requireAdminRole("super_admin", "admin", "support"),
  getUserDetails,
);

router.patch(
  "/:id/status",
  requireAdminRole("super_admin", "admin"),
  updateUserStatus,
);

router.delete("/:id", requireAdminRole("super_admin"), deleteUser);

export default router;
