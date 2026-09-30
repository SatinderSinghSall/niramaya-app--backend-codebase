import express from "express";

import {
  complete,
  create,
  getAll,
  getOne,
  pause,
  remove,
  resume,
  update,
  updateProgress,
} from "../controllers/goal.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createGoalSchema,
  progressSchema,
  updateGoalSchema,
} from "../utils/goal.validation.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(createGoalSchema), create);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", validate(updateGoalSchema), update);

router.delete("/:id", remove);

router.patch("/:id/progress", validate(progressSchema), updateProgress);

router.patch("/:id/complete", complete);

router.patch("/:id/pause", pause);

router.patch("/:id/resume", resume);

export default router;
