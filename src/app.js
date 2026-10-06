import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { connectDB } from "./config/db.js";
import { apiLogger } from "./middlewares/apiLogger.middleware.js";

import apiRoutes from "./routes/index.js";

const app = express();

/*
 * Security
 */
app.use(helmet());

/*
 * CORS
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8081",
  "https://niramaya-admin-panel.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);

/*
 * Request logging
 */
if (env.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

/*
 * Body parsing
 */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/*
 * Health check
 */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Niramaya API is running",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

/*
 * Database connection
 */
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database initialization failed:", {
      name: error.name,
      message: error.message,
    });

    res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Niramaya backend server API is LIVE.");
});

app.use("/api/v1", apiLogger, apiRoutes);

/*
 * 404 handler
 */
app.use(notFound);

/*
 * Global error handler
 */
app.use(errorHandler);

export default app;
