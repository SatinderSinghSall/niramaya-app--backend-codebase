import express from "express";

import { checkMaintenance } from "../controllers/maintenance.controller.js";

const router = express.Router();

/*
 * Public endpoint.
 *
 * Mobile application can check maintenance
 * before authentication.
 */
router.get("/", checkMaintenance);

export default router;
