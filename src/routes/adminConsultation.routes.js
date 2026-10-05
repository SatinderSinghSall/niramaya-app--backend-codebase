import express from "express";

import {
  list,
  stats,
  getOne,
  updateStatus,
  schedule,
  updateNotes,
  notifyUser,
} from "../controllers/admin/adminConsultation.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import {
  adminConsultationStatusSchema,
  adminConsultationScheduleSchema,
  adminConsultationNotesSchema,
  adminNotificationCreateSchema,
} from "../utils/adminCommunication.validation.js";

// Authentication/RBAC is intentionally applied by admin.routes.js.
// Mount this router under /consultations.
const router = express.Router();

router.get("/", list);
router.get("/stats", stats);
router.get("/:id", getOne);

router.patch(
  "/:id/status",
  validate(adminConsultationStatusSchema),
  updateStatus,
);

router.patch(
  "/:id/schedule",
  validate(adminConsultationScheduleSchema),
  schedule,
);

router.patch("/:id/notes", validate(adminConsultationNotesSchema), updateNotes);

router.post("/:id/notify", validate(adminNotificationCreateSchema), notifyUser);

export default router;
