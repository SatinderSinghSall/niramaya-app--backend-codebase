import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
  summary,
} from "../controllers/progress.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createProgressSchema,
  updateProgressSchema,
} from "../utils/progress.validation.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(createProgressSchema), create);

router.get("/summary", summary);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", validate(updateProgressSchema), update);

router.delete("/:id", remove);

export default router;
