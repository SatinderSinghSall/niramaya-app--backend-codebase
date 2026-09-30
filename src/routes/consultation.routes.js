import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  cancel,
  complete,
} from "../controllers/consultation.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  createConsultationSchema,
  updateConsultationSchema,
  cancellationSchema,
} from "../utils/consultation.validation.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(createConsultationSchema), create);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", validate(updateConsultationSchema), update);

router.patch("/:id/cancel", validate(cancellationSchema), cancel);

router.patch("/:id/complete", complete);

export default router;
