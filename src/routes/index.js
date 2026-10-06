import express from "express";

import authRoutes from "./auth.routes.js";
import healthProfileRoutes from "./healthProfile.routes.js";
import goalRoutes from "./goal.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import ayurvedaRoutes from "./ayurveda.routes.js";
import yogaRoutes from "./yoga.routes.js";
import recommendationRoutes from "./recommendation.routes.js";
import progressRoutes from "./progress.routes.js";
import consultationRoutes from "./consultation.routes.js";
import notificationRoutes from "./notification.routes.js";
import favoriteRoutes from "./favorite.routes.js";
import searchRoutes from "./search.routes.js";
import profileRoutes from "./profile.routes.js";
import appConfigRoutes from "./appConfig.routes.js";
import maintenanceRoutes from "./maintenance.routes.js";
import announcementRoutes from "./announcement.routes.js";
import healthWellnessTipRoutes from "./healthWellnessTip.routes.js";
import contactSubmissionRoutes from "./contactSubmission.routes.js";

import adminRoutes from "./admin.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/health-profile", healthProfileRoutes);

router.use("/goals", goalRoutes);

router.use("/dashboard", dashboardRoutes);

router.use("/ayurveda", ayurvedaRoutes);

router.use("/yoga", yogaRoutes);

router.use("/recommendations", recommendationRoutes);

router.use("/progress", progressRoutes);

router.use("/consultations", consultationRoutes);

router.use("/notifications", notificationRoutes);

router.use("/favorites", favoriteRoutes);

router.use("/search", searchRoutes);

router.use("/profile", profileRoutes);

router.use("/admin", adminRoutes);

router.use("/app-config", appConfigRoutes);

router.use("/maintenance", maintenanceRoutes);

router.use("/announcements", announcementRoutes);

router.use("/health-wellness-tips", healthWellnessTipRoutes);

router.use("/contact-submissions", contactSubmissionRoutes);

export default router;
