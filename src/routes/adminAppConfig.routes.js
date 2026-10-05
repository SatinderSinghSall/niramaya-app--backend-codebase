import { Router } from "express";

import {
  getAppConfigs,
  getAppConfig,
  addAppConfig,
  editAppConfig,
} from "../controllers/admin/adminAppConfig.controller.js";

import {
  authenticateAdmin,
  requireAdminRole,
} from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.use(authenticateAdmin);
router.use(requireAdminRole("super_admin"));

router.get("/", getAppConfigs);
router.get("/:platform", getAppConfig);
router.post("/", addAppConfig);
router.put("/:platform", editAppConfig);

export default router;
