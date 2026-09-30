import User from "../models/user.model.js";
import HealthProfile from "../models/healthProfile.model.js";
import Goal from "../models/goal.model.js";

export const getDashboard = async (userId) => {
  const [user, healthProfile, goals] = await Promise.all([
    User.findById(userId).lean(),

    HealthProfile.findOne({
      user: userId,
    }).lean(),

    Goal.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  if (!user) {
    const error = new Error("User not found");

    error.statusCode = 404;

    throw error;
  }

  const activeGoals = goals.filter((goal) => goal.status === "active");

  const pausedGoals = goals.filter((goal) => goal.status === "paused");

  const completedGoals = goals.filter((goal) => goal.status === "completed");

  const cancelledGoals = goals.filter((goal) => goal.status === "cancelled");

  const totalGoals = goals.length;

  const averageGoalProgress =
    activeGoals.length > 0
      ? Math.round(
          activeGoals.reduce(
            (total, goal) => total + goal.progressPercentage,
            0,
          ) / activeGoals.length,
        )
      : 0;

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

    goals: {
      total: totalGoals,

      active: activeGoals.length,

      paused: pausedGoals.length,

      completed: completedGoals.length,

      cancelled: cancelledGoals.length,

      averageProgress: averageGoalProgress,

      recent: goals.slice(0, 5),
    },
  };
};
