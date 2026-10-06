import mongoose from "mongoose";

import User from "../../models/user.model.js";
import HealthProfile from "../../models/healthProfile.model.js";
import Goal from "../../models/goal.model.js";
import Progress from "../../models/progress.model.js";
import Consultation from "../../models/consultation.model.js";
import Notification from "../../models/notification.model.js";
import Favorite from "../../models/favorite.model.js";
import Ayurveda from "../../models/ayurveda.model.js";
import Yoga from "../../models/yoga.model.js";
import Settings from "../../models/settings.model.js";
import Admin from "../../models/admin.model.js";
import ApiLog from "../../models/apiLog.model.js";
import AppConfig from "../../models/appConfig.model.js";
import Maintenance from "../../models/maintenance.model.js";
import Announcement from "../../models/announcement.model.js";
import HealthWellnessTip from "../../models/healthWellnessTip.model.js";
import ContactSubmission from "../../models/contactSubmission.model.js";

const count = (model, filter = {}) => model.countDocuments(filter);

const getStartOfToday = () => {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return date;
};

const getStartOfSevenDayPeriod = () => {
  const date = getStartOfToday();

  date.setDate(date.getDate() - 6);

  return date;
};

const getAdminIdentity = (admin) => {
  if (!admin) {
    return null;
  }

  return {
    id: admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    name: `${admin.firstName || ""} ${admin.lastName || ""}`.trim(),
    email: admin.email,
    role: admin.role,
  };
};

const getSystemHealth = async () => {
  const startedAt = Date.now();

  let databaseStatus = "unavailable";
  let databaseLatencyMs = null;

  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const databasePingStartedAt = Date.now();

      await mongoose.connection.db.admin().ping();

      databaseLatencyMs = Date.now() - databasePingStartedAt;
      databaseStatus = "healthy";
    }
  } catch (error) {
    databaseStatus = "unhealthy";

    console.error("Dashboard database health check failed:", {
      name: error.name,
      message: error.message,
    });
  }

  const uptimeSeconds = Math.floor(process.uptime());

  return {
    api: {
      status: "healthy",
      responseTimeMs: Date.now() - startedAt,
    },

    database: {
      status: databaseStatus,
      latencyMs: databaseLatencyMs,
      connectionState: mongoose.connection.readyState,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },

    server: {
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      uptimeSeconds,
      uptimeFormatted: formatUptime(uptimeSeconds),
    },
  };
};

const formatUptime = (totalSeconds) => {
  const seconds = Math.max(0, totalSeconds);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  if (hours > 0 || days > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0 || hours > 0 || days > 0) {
    parts.push(`${minutes}m`);
  }

  parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
};

const getTodayApiActivity = async () => {
  const startOfToday = getStartOfToday();

  const [summary] = await ApiLog.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfToday,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRequests: {
          $sum: 1,
        },
        successfulRequests: {
          $sum: {
            $cond: [{ $lt: ["$statusCode", 400] }, 1, 0],
          },
        },
        failedRequests: {
          $sum: {
            $cond: [{ $gte: ["$statusCode", 400] }, 1, 0],
          },
        },
        averageResponseTimeMs: {
          $avg: "$responseTimeMs",
        },
      },
    },
  ]);

  return {
    totalRequests: summary?.totalRequests || 0,
    successfulRequests: summary?.successfulRequests || 0,
    failedRequests: summary?.failedRequests || 0,
    averageResponseTimeMs: summary
      ? Number((summary.averageResponseTimeMs || 0).toFixed(1))
      : 0,
  };
};

const getSevenDayApiActivity = async () => {
  const startOfSevenDayPeriod = getStartOfSevenDayPeriod();

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const results = await ApiLog.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfSevenDayPeriod,
        },
      },
    },

    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: timeZone,
            },
          },
        },

        requests: {
          $sum: 1,
        },

        successfulRequests: {
          $sum: {
            $cond: [{ $lt: ["$statusCode", 400] }, 1, 0],
          },
        },

        failedRequests: {
          $sum: {
            $cond: [{ $gte: ["$statusCode", 400] }, 1, 0],
          },
        },

        averageResponseTimeMs: {
          $avg: "$responseTimeMs",
        },
      },
    },

    {
      $sort: {
        "_id.date": 1,
      },
    },
  ]);

  const resultMap = new Map();

  for (const item of results) {
    resultMap.set(item._id.date, {
      date: item._id.date,
      requests: item.requests,
      successfulRequests: item.successfulRequests,
      failedRequests: item.failedRequests,
      averageResponseTimeMs: Number(
        (item.averageResponseTimeMs || 0).toFixed(1),
      ),
    });
  }

  const sevenDayActivity = [];

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(startOfSevenDayPeriod);

    date.setDate(startOfSevenDayPeriod.getDate() + index);

    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    sevenDayActivity.push(
      resultMap.get(dateKey) || {
        date: dateKey,
        requests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTimeMs: 0,
      },
    );
  }

  return sevenDayActivity;
};

const getRecentApiActivity = async () => {
  return ApiLog.find({})
    .populate("admin", "firstName lastName email role")
    .select(
      "method route statusCode responseTimeMs admin ipAddress errorCode errorMessage createdAt",
    )
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();
};

const getApiActivity = async () => {
  const [today, sevenDays, recent] = await Promise.all([
    getTodayApiActivity(),
    getSevenDayApiActivity(),
    getRecentApiActivity(),
  ]);

  return {
    today,
    sevenDays,
    recent,
  };
};

export const getAdminDashboard = async (admin = null) => {
  const [
    users,
    activeUsers,
    healthProfiles,
    goals,
    activeGoals,
    completedGoals,
    progressEntries,
    consultations,
    pendingConsultations,
    notifications,
    unreadNotifications,
    favorites,
    ayurveda,
    activeAyurveda,
    yoga,
    activeYoga,
    settings,
    admins,
    activeAdmins,
    apiLogs,
    appConfigs,
    announcements,
    maintenances,
    healthWellnessTips,
    contactSubmissions,
  ] = await Promise.all([
    count(User),
    count(User, { isActive: true }),
    count(HealthProfile),
    count(Goal),
    count(Goal, { status: "active" }),
    count(Goal, { status: "completed" }),
    count(Progress),
    count(Consultation),
    count(Consultation, { status: "requested" }),
    count(Notification),
    count(Notification, { isRead: false }),
    count(Favorite),
    count(Ayurveda),
    count(Ayurveda, { isActive: true }),
    count(Yoga),
    count(Yoga, { isActive: true }),
    count(Settings),
    count(Admin),
    count(Admin, { isActive: true }),
    count(ApiLog),
    count(AppConfig),
    count(Announcement),
    count(Maintenance),
    count(HealthWellnessTip),
    count(ContactSubmission),
  ]);

  const [recentUsers, recentConsultations, systemHealth, apiActivity] =
    await Promise.all([
      User.find({})
        .select("firstName lastName email isActive lastLoginAt createdAt")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),

      Consultation.find({})
        .populate("user", "firstName lastName email")
        .select(
          "user consultationType preferredDate preferredTime status scheduledAt createdAt",
        )
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),

      getSystemHealth(),

      getApiActivity(),
    ]);

  const collectionSummary = [
    ["users", users],
    ["healthProfiles", healthProfiles],
    ["goals", goals],
    ["progress", progressEntries],
    ["consultations", consultations],
    ["notifications", notifications],
    ["favorites", favorites],
    ["settings", settings],
    ["ayurvedas", ayurveda],
    ["yogas", yoga],
    ["admins", admins],
    ["appConfigs", appConfigs],
    ["announcements", announcements],
    ["healthwellnesstips", healthWellnessTips],
    ["maintenances", maintenances],
    ["apilogs", apiLogs],
    ["contactsubmissions", contactSubmissions],
  ].map(([name, documents]) => ({
    name,
    documents,
  }));

  return {
    generatedAt: new Date(),

    admin: getAdminIdentity(admin),

    overview: {
      users,
      activeUsers,
      healthProfiles,
      goals,
      activeGoals,
      completedGoals,
      progressEntries,
      consultations,
      pendingConsultations,
      notifications,
      unreadNotifications,
      favorites,
      admins,
      activeAdmins,
    },

    content: {
      ayurveda,
      activeAyurveda,
      yoga,
      activeYoga,
    },

    coverage: {
      healthProfileCoverage:
        users === 0 ? 0 : Number(((healthProfiles / users) * 100).toFixed(1)),

      settingsCoverage:
        users === 0 ? 0 : Number(((settings / users) * 100).toFixed(1)),
    },

    collections: collectionSummary,

    recentUsers,

    recentConsultations,

    systemHealth,

    apiActivity,
  };
};
