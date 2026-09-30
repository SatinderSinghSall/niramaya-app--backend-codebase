import express from "express";

import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
} from "../controllers/healthProfile.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import { healthProfileSchema } from "../utils/healthProfile.validation.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(healthProfileSchema), createProfile);

router.get("/", getProfile);

router.patch("/", validate(healthProfileSchema), updateProfile);

router.delete("/", deleteProfile);

export default router;
