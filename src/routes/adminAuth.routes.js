import express from "express";
import {
  login,
  refresh,
  logout,
  me,
} from "../controllers/admin/adminAuth.controller.js";
import { authenticateAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authenticateAdmin, logout);
router.get("/me", authenticateAdmin, me);

export default router;
