import express from "express";
import { getDashboard } from "../controllers/admin/adminDashboard.controller.js";
import { authenticateAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.use(authenticateAdmin);
router.get("/", getDashboard);

export default router;
