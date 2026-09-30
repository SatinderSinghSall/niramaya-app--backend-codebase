import Progress from "../models/progress.model.js";
import Goal from "../models/goal.model.js";

const createDateRange = (startDate, endDate) => {
  const filter = {};

  if (startDate || endDate) {
    filter.date = {};

    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);

      end.setHours(23, 59, 59, 999);

      filter.date.$lte = end;
    }
  }

  return filter;
};

export const createProgress = async (userId, data) => {
  const date = data.date ? new Date(data.date) : new Date();

  date.setHours(0, 0, 0, 0);

  const progress = await Progress.findOneAndUpdate(
    {
      user: userId,
      date,
    },
    {
      $set: {
        ...data,
        user: userId,
        date,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  ).lean();

  return progress;
};

export const getProgressById = async (userId, progressId) => {
  const progress = await Progress.findOne({
    _id: progressId,
    user: userId,
  }).lean();

  if (!progress) {
    const error = new Error("Progress entry not found");

    error.statusCode = 404;

    throw error;
  }

  return progress;
};

export const getProgressHistory = async ({
  userId,
  startDate,
  endDate,
  page = 1,
  limit = 30,
}) => {
  const dateFilter = createDateRange(startDate, endDate);

  const filter = {
    user: userId,
    ...dateFilter,
  };

  const skip = (page - 1) * limit;

  const [entries, total] = await Promise.all([
    Progress.find(filter)
      .sort({
        date: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Progress.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    entries,

    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const updateProgress = async (userId, progressId, data) => {
  const progress = await Progress.findOneAndUpdate(
    {
      _id: progressId,
      user: userId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!progress) {
    const error = new Error("Progress entry not found");

    error.statusCode = 404;

    throw error;
  }

  return progress;
};

export const deleteProgress = async (userId, progressId) => {
  const progress = await Progress.findOneAndDelete({
    _id: progressId,
    user: userId,
  });

  if (!progress) {
    const error = new Error("Progress entry not found");

    error.statusCode = 404;

    throw error;
  }

  return {
    message: "Progress entry deleted successfully",
  };
};

const calculateAverage = (entries, field) => {
  const values = entries
    .map((entry) => entry[field])
    .filter((value) => typeof value === "number");

  if (values.length === 0) {
    return null;
  }

  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2),
  );
};

const calculateTotal = (entries, field) => {
  return entries.reduce((total, entry) => {
    return total + (typeof entry[field] === "number" ? entry[field] : 0);
  }, 0);
};

export const getProgressSummary = async (userId, startDate, endDate) => {
  const dateFilter = createDateRange(startDate, endDate);

  const entries = await Progress.find({
    user: userId,
    ...dateFilter,
  })
    .sort({
      date: 1,
    })
    .lean();

  const activeGoals = await Goal.find({
    user: userId,
    status: "active",
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  return {
    period: {
      startDate: startDate || null,
      endDate: endDate || null,
    },

    tracking: {
      daysTracked: entries.length,

      averageMood: calculateAverage(entries, "mood"),

      averageEnergyLevel: calculateAverage(entries, "energyLevel"),

      averageStressLevel: calculateAverage(entries, "stressLevel"),

      averageSleepHours: calculateAverage(entries, "sleepHours"),

      averageSleepQuality: calculateAverage(entries, "sleepQuality"),

      averageWaterIntakeLiters: calculateAverage(entries, "waterIntakeLiters"),

      averageSteps: calculateAverage(entries, "steps"),

      totalExerciseMinutes: calculateTotal(entries, "exerciseMinutes"),

      totalYogaMinutes: calculateTotal(entries, "yogaMinutes"),

      totalMeditationMinutes: calculateTotal(entries, "meditationMinutes"),
    },

    goals: activeGoals.map((goal) => ({
      id: goal._id,
      title: goal.title,
      category: goal.category,
      progressPercentage: goal.progressPercentage,
      status: goal.status,
    })),
  };
};
