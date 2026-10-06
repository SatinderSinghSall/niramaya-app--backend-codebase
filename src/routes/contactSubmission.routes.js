import express from "express";
import { createContactSubmissionController } from "../controllers/contactSubmission.controller.js";

const router = express.Router();

router.post("/", createContactSubmissionController);

export default router;
