import User from "../models/user.model.js";
import HealthProfile from "../models/healthProfile.model.js";
import Goal from "../models/goal.model.js";
import Consultation from "../models/consultation.model.js";
import Progress from "../models/progress.model.js";
import Announcement from "../models/announcement.model.js";
import HealthWellnessTip from "../models/healthWellnessTip.model.js";
import Notification from "../models/notification.model.js";
import Favorite from "../models/favorite.model.js";
import Yoga from "../models/yoga.model.js";
import Ayurveda from "../models/ayurveda.model.js";

const RECENT_LIMIT = 3;
const GOAL_LIMIT = 5;
const NOTIFICATION_LIMIT = 3;
const FAVORITE_LIMIT = 3;
const CONTENT_LIMIT = 3;

const getFavoriteModel = (itemType) => {
  if (itemType === "yoga") return Yoga;
  if (itemType === "ayurveda") return Ayurveda;
  return null;
};

const toFavoriteSummary = (favorite, itemData) => ({
  id: favorite._id,
  itemType: favorite.itemType,
  itemId: favorite.item,
  createdAt: favorite.createdAt,
  itemData: itemData
    ? {
        id: itemData._id,
        title: itemData.title,
        shortDescription:
          itemData.shortDescription ?? itemData.description ?? "",
        category: itemData.category ?? null,
        type: itemData.type ?? null,
        thumbnailUrl: itemData.thumbnailUrl ?? null,
        image: itemData.image?.enabled
          ? {
              url: itemData.image.url ?? null,
              altText: itemData.image.altText ?? null,
            }
          : null,
        isFeatured: itemData.isFeatured ?? false,
      }
    : null,
});

const getDayBounds = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

const getVisibleContentFilter = (now) => ({
  isActive: true,
  startDate: { $lte: now },
  $or: [{ endDate: null }, { endDate: { $gte: now } }],
});

const toGoalSummary = (goal) => ({
  id: goal._id,
  title: goal.title,
  category: goal.category,
  target: goal.target,
  currentValue: goal.currentValue,
  progressPercentage: goal.progressPercentage ?? 0,
  status: goal.status,
  startDate: goal.startDate,
  targetDate: goal.targetDate,
  completedAt: goal.completedAt ?? null,
  createdAt: goal.createdAt,
});

const toConsultationSummary = (item) => ({
  id: item._id,
  consultationType: item.consultationType,
  preferredDate: item.preferredDate,
  preferredTime: item.preferredTime,
  status: item.status,
  consultant: {
    name: item.consultant?.name ?? null,
    specialization: item.consultant?.specialization ?? null,
  },
  scheduledAt: item.scheduledAt ?? null,
  createdAt: item.createdAt,
});

const toProgressSummary = (entry) => ({
  id: entry._id,
  date: entry.date,
  mood: entry.mood ?? null,
  energyLevel: entry.energyLevel ?? null,
  stressLevel: entry.stressLevel ?? null,
  sleepHours: entry.sleepHours ?? null,
  sleepQuality: entry.sleepQuality ?? null,
  waterIntakeLiters: entry.waterIntakeLiters ?? null,
  steps: entry.steps ?? null,
  exerciseMinutes: entry.exerciseMinutes ?? null,
  yogaMinutes: entry.yogaMinutes ?? null,
  meditationMinutes: entry.meditationMinutes ?? null,
  weightKg: entry.weightKg ?? null,
  completedActivities: entry.completedActivities ?? [],
});

const toAnnouncementSummary = (item) => ({
  id: item._id,
  title: item.title,
  message: item.message,
  type: item.type,
  startDate: item.startDate,
  endDate: item.endDate ?? null,
  action: item.action,
  createdAt: item.createdAt,
});

const toWellnessTipSummary = (item) => ({
  id: item._id,
  title: item.title,
  shortDescription: item.shortDescription,
  category: item.category,
  type: item.type,
  thumbnailUrl: item.thumbnailUrl ?? null,
  image: item.image?.enabled
    ? {
        url: item.image.url ?? null,
        altText: item.image.altText ?? null,
      }
    : null,
  readTimeMinutes: item.readTimeMinutes,
  featured: item.featured,
  disclaimer: item.disclaimer,
  safetyNote: item.safetyNote ?? null,
  action: item.action,
  startDate: item.startDate,
});

const toNotificationSummary = (item) => ({
  id: item._id,
  type: item.type,
  title: item.title,
  message: item.message,
  isRead: item.isRead,
  createdAt: item.createdAt,
  action: item.action,
});

export const getDashboard = async (userId) => {
  const now = new Date();
  const { start: todayStart, end: tomorrowStart } = getDayBounds(now);

  const visibleContentFilter = getVisibleContentFilter(now);

  const activeConsultationStatuses = ["requested", "confirmed", "rescheduled"];

  const notificationFilter = {
    user: userId,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
  };

  const [
    user,
    healthProfile,
    goalStats,
    recentGoals,
    upcomingConsultations,
    recentConsultations,
    todayProgress,
    recentProgress,
    announcements,
    wellnessTips,
    unreadNotificationCount,
    recentNotifications,
    favoriteRecords,
    featuredYoga,
    featuredAyurveda,
  ] = await Promise.all([
    User.findById(userId).select("firstName lastName email").lean(),

    HealthProfile.findOne({ user: userId })
      .select(
        [
          "onboarding.completed",
          "onboarding.completionPercentage",
          "personal.heightCm",
          "personal.weightKg",
          "physicalHealth.energyLevel",
          "physicalHealth.digestion",
          "wellbeing.stressLevel",
          "wellbeing.mood",
          "lifestyle.activityLevel",
          "sleep.averageHours",
          "sleep.sleepQuality",
          "fitness.yogaExperience",
        ].join(" "),
      )
      .lean(),

    Goal.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          averageProgress: { $avg: "$progressPercentage" },
        },
      },
    ]),

    Goal.find({ user: userId })
      .select(
        "title category target currentValue progressPercentage status startDate targetDate completedAt createdAt",
      )
      .sort({ createdAt: -1 })
      .limit(GOAL_LIMIT)
      .lean(),

    Consultation.find({
      user: userId,
      status: { $in: activeConsultationStatuses },
      $or: [
        { scheduledAt: { $gte: now } },
        {
          scheduledAt: null,
          preferredDate: { $gte: todayStart },
        },
      ],
    })
      .select(
        "consultationType preferredDate preferredTime status consultant.name consultant.specialization scheduledAt createdAt",
      )
      .sort({ scheduledAt: 1, preferredDate: 1 })
      .limit(RECENT_LIMIT)
      .lean(),

    Consultation.find({ user: userId })
      .select(
        "consultationType preferredDate preferredTime status consultant.name consultant.specialization scheduledAt createdAt",
      )
      .sort({ createdAt: -1 })
      .limit(RECENT_LIMIT)
      .lean(),

    Progress.findOne({
      user: userId,
      date: { $gte: todayStart, $lt: tomorrowStart },
    })
      .select(
        "date mood energyLevel stressLevel sleepHours sleepQuality waterIntakeLiters steps exerciseMinutes yogaMinutes meditationMinutes weightKg completedActivities",
      )
      .lean(),

    Progress.find({ user: userId })
      .select(
        "date mood energyLevel stressLevel sleepHours sleepQuality waterIntakeLiters steps exerciseMinutes yogaMinutes meditationMinutes weightKg completedActivities",
      )
      .sort({ date: -1 })
      .limit(RECENT_LIMIT)
      .lean(),

    Announcement.find(visibleContentFilter)
      .select("title message type startDate endDate action createdAt")
      .sort({ startDate: -1, createdAt: -1 })
      .limit(RECENT_LIMIT)
      .lean(),

    HealthWellnessTip.find(visibleContentFilter)
      .select(
        "title shortDescription category type thumbnailUrl image.enabled image.url image.altText readTimeMinutes featured disclaimer safetyNote action startDate priority createdAt",
      )
      .sort({ featured: -1, priority: -1, startDate: -1 })
      .limit(RECENT_LIMIT)
      .lean(),

    Notification.countDocuments({
      ...notificationFilter,
      isRead: false,
    }),

    Notification.find(notificationFilter)
      .select("type title message isRead createdAt action")
      .sort({ createdAt: -1 })
      .limit(NOTIFICATION_LIMIT)
      .lean(),

    // Recent saved Yoga and Ayurveda items
    Favorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(FAVORITE_LIMIT)
      .lean(),

    // Featured active Yoga content
    Yoga.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .limit(CONTENT_LIMIT)
      .lean(),

    // Featured active Ayurveda content
    Ayurveda.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .limit(CONTENT_LIMIT)
      .lean(),
  ]);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Attach the saved Yoga/Ayurveda content to each favourite.
  const favorites = await Promise.all(
    favoriteRecords.map(async (favorite) => {
      const Model = getFavoriteModel(favorite.itemType);

      if (!Model) {
        return toFavoriteSummary(favorite, null);
      }

      const itemData = await Model.findOne({
        _id: favorite.item,
        isActive: true,
      }).lean();

      return toFavoriteSummary(favorite, itemData);
    }),
  );

  const statsByStatus = Object.fromEntries(
    goalStats.map((item) => [item._id, item]),
  );

  const activeGoalStats = statsByStatus.active;

  const averageGoalProgress = activeGoalStats
    ? Math.round(activeGoalStats.averageProgress ?? 0)
    : 0;

  const recentConsultationIds = new Set(
    recentConsultations.map((item) => String(item._id)),
  );

  const upcomingIds = new Set(
    upcomingConsultations.map((item) => String(item._id)),
  );

  // Avoid duplicate records if a recent consultation is also upcoming.
  const recentConsultationItems = recentConsultations
    .filter((item) => !upcomingIds.has(String(item._id)))
    .slice(0, RECENT_LIMIT);

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },

    profile: {
      exists: Boolean(healthProfile),
      completed: healthProfile?.onboarding?.completed ?? false,
      completionPercentage:
        healthProfile?.onboarding?.completionPercentage ?? 0,
      needsCompletion:
        !healthProfile || !(healthProfile.onboarding?.completed ?? false),
    },

    healthSnapshot: healthProfile
      ? {
          heightCm: healthProfile.personal?.heightCm ?? null,
          weightKg: healthProfile.personal?.weightKg ?? null,
          energyLevel: healthProfile.physicalHealth?.energyLevel ?? null,
          digestion: healthProfile.physicalHealth?.digestion ?? null,
          stressLevel: healthProfile.wellbeing?.stressLevel ?? null,
          mood: healthProfile.wellbeing?.mood ?? null,
          activityLevel: healthProfile.lifestyle?.activityLevel ?? null,
          sleepHours: healthProfile.sleep?.averageHours ?? null,
          sleepQuality: healthProfile.sleep?.sleepQuality ?? null,
          yogaExperience: healthProfile.fitness?.yogaExperience ?? null,
        }
      : null,

    consultations: {
      upcoming: upcomingConsultations.map(toConsultationSummary),
      recent: recentConsultationItems.map(toConsultationSummary),
      hasUpcoming: upcomingConsultations.length > 0,
      hasAny: recentConsultations.length > 0,
      showBookingCTA:
        upcomingConsultations.length === 0 && recentConsultations.length === 0,
    },

    goals: {
      total: goalStats.reduce((sum, item) => sum + item.count, 0),
      active: statsByStatus.active?.count ?? 0,
      paused: statsByStatus.paused?.count ?? 0,
      completed: statsByStatus.completed?.count ?? 0,
      cancelled: statsByStatus.cancelled?.count ?? 0,
      averageProgress: averageGoalProgress,
      recent: recentGoals.map(toGoalSummary),
      showCreateCTA: !goalStats.some((item) => item.count > 0),
    },

    progress: {
      today: todayProgress ? toProgressSummary(todayProgress) : null,
      recent: recentProgress.map(toProgressSummary),
      hasData: recentProgress.length > 0,
      hasTodayEntry: Boolean(todayProgress),
      showLogCTA: !todayProgress,
    },

    announcements: {
      items: announcements.map(toAnnouncementSummary),
      hasItems: announcements.length > 0,
    },

    wellnessTips: {
      items: wellnessTips.map(toWellnessTipSummary),
      hasItems: wellnessTips.length > 0,
    },

    notifications: {
      unreadCount: unreadNotificationCount,
      recent: recentNotifications.map(toNotificationSummary),
      hasUnread: unreadNotificationCount > 0,
    },

    favorites: {
      items: favorites,
      total: await Favorite.countDocuments({ user: userId }),
      hasItems: favorites.some((item) => item.itemData !== null),
    },

    yoga: {
      items: featuredYoga.map((item) => ({
        id: item._id,
        title: item.title,
        shortDescription: item.shortDescription ?? item.description ?? "",
        category: item.category ?? null,
        difficulty: item.difficulty ?? null,
        thumbnailUrl: item.thumbnailUrl ?? null,
        isFeatured: item.isFeatured ?? false,
      })),
    },

    ayurveda: {
      items: featuredAyurveda.map((item) => ({
        id: item._id,
        title: item.title,
        shortDescription: item.shortDescription ?? item.description ?? "",
        category: item.category ?? null,
        type: item.type ?? null,
        thumbnailUrl: item.thumbnailUrl ?? null,
        isFeatured: item.isFeatured ?? false,
      })),
    },
  };
};
