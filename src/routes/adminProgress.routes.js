import { Router } from "express";
import {
  authenticateAdmin,
  requireAdminRole,
} from "../middlewares/adminAuth.middleware.js";
import {
  list,
  stats,
  getOne,
  userWellness,
  update,
  remove,
} from "../controllers/admin/adminProgress.controller.js";

const router = Router();
router.use(authenticateAdmin);
router.get("/", requireAdminRole("super_admin", "admin", "support"), list);
router.get(
  "/stats",
  requireAdminRole("super_admin", "admin", "support"),
  stats,
);
router.get(
  "/users/:userId",
  requireAdminRole("super_admin", "admin", "support"),
  userWellness,
);
router.get("/:id", requireAdminRole("super_admin", "admin", "support"), getOne);
router.patch("/:id", requireAdminRole("super_admin", "admin"), update);
router.delete("/:id", requireAdminRole("super_admin"), remove);
export default router;
