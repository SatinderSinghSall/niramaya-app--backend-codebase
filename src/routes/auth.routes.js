import express from "express";

import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controller.js";

import { getCurrentUser } from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import { loginSchema, signupSchema } from "../utils/validation.util.js";

const router = express.Router();

router.post("/register", validate(signupSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", authenticate, logout);

router.get("/me", authenticate, getCurrentUser);

export default router;
