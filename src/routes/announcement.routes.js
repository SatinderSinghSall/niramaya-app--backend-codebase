import express from "express";

import { getActiveAnnouncements } from "../controllers/announcement.controller.js";

const router = express.Router();

router.get("/", getActiveAnnouncements);

export default router;
