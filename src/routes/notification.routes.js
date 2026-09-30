import express from "express";

import {
  create,
  getAll,
  getUnread,
  getOne,
  markRead,
  markAllRead,
  remove,
  removeRead,
} from "../controllers/notification.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import { createNotificationSchema } from "../utils/notification.validation.js";

const router = express.Router();

router.use(authenticate);

/*
 * Create notification
 *
 * This endpoint is currently available
 * for the authenticated user.
 */
router.post("/", validate(createNotificationSchema), create);

/*
 * Get all notifications
 */
router.get("/", getAll);

/*
 * Get unread count
 *
 * Keep this BEFORE /:id
 */
router.get("/unread-count", getUnread);

/*
 * Mark all as read
 *
 * Keep this BEFORE /:id
 */
router.patch("/read-all", markAllRead);

/*
 * Delete all read notifications
 *
 * Keep this BEFORE /:id
 */
router.delete("/read", removeRead);

/*
 * Get one notification
 */
router.get("/:id", getOne);

/*
 * Mark one as read
 */
router.patch("/:id/read", markRead);

/*
 * Delete one notification
 */
router.delete("/:id", remove);

export default router;
