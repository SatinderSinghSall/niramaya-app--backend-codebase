import mongoose from "mongoose";
import Goal from "../../models/goal.model.js";
import User from "../../models/user.model.js";

const ensureObjectId = (value, label = "id") => {
  if (!mongoose.isValidObjectId(value)) {
    const error = new Error(`Invalid ${label}`);
    error.statusCode = 400;
    throw error;
  }
  return value;
};

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getStatusValues = () =>
  Goal.schema.path("status")?.enumValues || [
    "active",
    "paused",
    "completed",
    "cancelled",
  ];

const buildDateFilter = (dateFrom, dateTo) => {
  if (!dateFrom && !dateTo) return undefined;
  const date = {};
  if (dateFrom) date.$gte = new Date(dateFrom);
  if (dateTo) {
    const end = new Date(dateTo);
    end.setHours(23, 59, 59, 999);
    date.$lte = end;
  }
  return date;
};

const safeUser = (user) =>
  user
    ? {
        id: user._id?.toString?.() || user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
      }
    : null;

export const listGoals = async ({
  page = 1,
  limit = 25,
  search,
  status,
  category,
  userId,
  dateFrom,
  dateTo,
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const filter = {};
  if (userId) filter.user = ensureObjectId(userId, "userId");
  if (status) filter.status = status;
  if (category) filter.category = category;
  const dateFilter = buildDateFilter(dateFrom, dateTo);
  if (dateFilter) filter.startDate = dateFilter;
  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [
      { title: regex },
      { description: regex },
      { category: regex },
    ];
  }

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  const skip = (safePage - 1) * safeLimit;

  const [goals, total] = await Promise.all([
    Goal.find(filter).sort(sort).skip(skip).limit(safeLimit).lean(),
    Goal.countDocuments(filter),
  ]);

  const userIds = [
    ...new Set(goals.map((goal) => goal.user?.toString()).filter(Boolean)),
  ];
  const users = userIds.length
    ? await User.find({ _id: { $in: userIds } })
        .select("firstName lastName email isActive")
        .lean()
    : [];
  const userMap = new Map(users.map((user) => [user._id.toString(), user]));

  return {
    items: goals.map((goal) => ({
      ...goal,
      user: safeUser(userMap.get(goal.user?.toString())) || { id: goal.user },
    })),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
      hasNextPage: safePage * safeLimit < total,
      hasPreviousPage: safePage > 1,
    },
  };
};

export const getGoal = async (id) => {
  ensureObjectId(id, "goal id");
  const goal = await Goal.findById(id).lean();
  if (!goal) {
    const e = new Error("Goal not found");
    e.statusCode = 404;
    throw e;
  }
  const user = await User.findById(goal.user)
    .select("firstName lastName email isActive createdAt")
    .lean();
  return { goal, user: safeUser(user) };
};

export const getGoalStats = async () => {
  const [byStatus, byCategory, progress, dueSoon, overdue] = await Promise.all([
    Goal.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Goal.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
    Goal.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: null,
          averageProgress: { $avg: "$progressPercentage" },
          averageCurrentValue: { $avg: "$currentValue" },
          count: { $sum: 1 },
        },
      },
    ]),
    Goal.countDocuments({
      status: { $in: ["active", "paused"] },
      targetDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 86400000),
      },
    }),
    Goal.countDocuments({
      status: { $in: ["active", "paused"] },
      targetDate: { $lt: new Date() },
    }),
  ]);
  const statusMap = Object.fromEntries(byStatus.map((x) => [x._id, x.count]));
  return {
    total: Object.values(statusMap).reduce((a, b) => a + b, 0),
    byStatus: statusMap,
    byCategory: byCategory.map((x) => ({ category: x._id, count: x.count })),
    activeProgress: progress[0] || {
      averageProgress: 0,
      averageCurrentValue: 0,
      count: 0,
    },
    dueSoon,
    overdue,
    statusValues: getStatusValues(),
  };
};

export const updateGoalStatus = async (id, status, reason) => {
  ensureObjectId(id, "goal id");
  if (!getStatusValues().includes(status)) {
    const e = new Error(`Unsupported goal status: ${status}`);
    e.statusCode = 400;
    throw e;
  }
  const goal = await Goal.findById(id);
  if (!goal) {
    const e = new Error("Goal not found");
    e.statusCode = 404;
    throw e;
  }
  if (goal.status === "completed" && status !== "completed") {
    const e = new Error("Completed goals cannot be moved to another status");
    e.statusCode = 400;
    throw e;
  }
  if (goal.status === "cancelled" && status !== "cancelled") {
    const e = new Error("Cancelled goals cannot be reopened");
    e.statusCode = 400;
    throw e;
  }
  if (status === "completed") {
    goal.progressPercentage = 100;
    goal.completedAt = goal.completedAt || new Date();
  }
  if (status === "cancelled" && reason) goal.cancellationReason = reason;
  goal.status = status;
  await goal.save();
  return goal.toObject();
};

export const updateGoalProgress = async (
  id,
  currentValue,
  progressPercentage,
) => {
  ensureObjectId(id, "goal id");
  const goal = await Goal.findById(id);
  if (!goal) {
    const e = new Error("Goal not found");
    e.statusCode = 404;
    throw e;
  }
  if (["completed", "cancelled"].includes(goal.status)) {
    const e = new Error(
      "Completed or cancelled goals cannot receive progress updates",
    );
    e.statusCode = 400;
    throw e;
  }
  goal.currentValue = currentValue;
  if (progressPercentage !== undefined)
    goal.progressPercentage = progressPercentage;
  else if (goal.target?.value && goal.target.value > 0)
    goal.progressPercentage = Math.min(
      100,
      Math.max(0, (currentValue / goal.target.value) * 100),
    );
  await goal.save();
  return goal.toObject();
};
