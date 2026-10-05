import { Router } from "express";
import adminAuthRoutes from "./adminAuth.routes.js";
import adminDashboardRoutes from "./adminDashboard.routes.js";
import adminDatabaseRoutes from "./adminDatabase.routes.js";
import adminManagementRoutes from "./adminManagement.routes.js";
import adminUserRoutes from "./adminUser.routes.js";
import { adminAyurvedaRoutes, adminYogaRoutes } from "./adminContent.routes.js";
import adminConsultationRoutes from "./adminConsultation.routes.js";
import adminNotificationRoutes from "./adminNotification.routes.js";
import adminGoalRoutes from "./adminGoal.routes.js";
import adminProgressRoutes from "./adminProgress.routes.js";
import adminApiLogRoutes from "./adminApiLog.routes.js";

const router = Router();

router.use("/auth", adminAuthRoutes);
router.use("/dashboard", adminDashboardRoutes);
router.use("/database", adminDatabaseRoutes);
router.use("/admins", adminManagementRoutes);
router.use("/users", adminUserRoutes);
router.use("/ayurveda", adminAyurvedaRoutes);
router.use("/yoga", adminYogaRoutes);
router.use("/consultations", adminConsultationRoutes);
router.use("/notifications", adminNotificationRoutes);
router.use("/goals", adminGoalRoutes);
router.use("/progress", adminProgressRoutes);
router.use("/api-logs", adminApiLogRoutes);

export default router;
