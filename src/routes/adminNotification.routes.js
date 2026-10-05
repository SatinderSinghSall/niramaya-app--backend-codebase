import express from "express";

import {
  list,
  stats,
  getOne,
  create,
  createBulk,
  markRead,
  remove,
  removeRead,
} from "../controllers/admin/adminNotification.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import {
  adminNotificationCreateSchema,
  adminBulkNotificationSchema,
  adminNotificationReadSchema,
} from "../utils/adminCommunication.validation.js";

// Authentication/RBAC is intentionally applied by admin.routes.js.
// Mount this router under /notifications.
const router = express.Router();

router.get("/", list);
router.get("/stats", stats);
router.get("/:id", getOne);

router.post("/user/:userId", validate(adminNotificationCreateSchema), create);

router.post("/bulk", validate(adminBulkNotificationSchema), createBulk);

router.patch("/:id/read", validate(adminNotificationReadSchema), markRead);

router.delete("/read", removeRead);
router.delete("/:id", remove);

export default router;
