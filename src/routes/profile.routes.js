import express from "express";

import {
  getCurrentProfile,
  updateCurrentProfile,
  updatePassword,
  getUserSettings,
  updateUserSettings,
  removeAccount,
} from "../controllers/profile.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  updateProfileSchema,
  changePasswordSchema,
  updateSettingsSchema,
  deleteAccountSchema,
} from "../utils/profile.validation.js";

const router = express.Router();

router.use(authenticate);

/*
 * Profile
 */
router.get("/", getCurrentProfile);

router.patch("/", validate(updateProfileSchema), updateCurrentProfile);

/*
 * Password
 */
router.patch("/password", validate(changePasswordSchema), updatePassword);

/*
 * Settings
 */
router.get("/settings", getUserSettings);

router.patch("/settings", validate(updateSettingsSchema), updateUserSettings);

/*
 * Account
 */
router.delete("/account", validate(deleteAccountSchema), removeAccount);

export default router;
