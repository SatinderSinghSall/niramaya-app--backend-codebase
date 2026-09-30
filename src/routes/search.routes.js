import express from "express";

import { search } from "../controllers/search.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", search);

export default router;
