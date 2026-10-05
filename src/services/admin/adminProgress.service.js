import mongoose from "mongoose";
import Progress from "../../models/progress.model.js";
import User from "../../models/user.model.js";

const ensureObjectId = (value, label = "id") => {
  if (!mongoose.isValidObjectId(value)) {
    const e = new Error(`Invalid ${label}`);
    e.statusCode = 400;
    throw e;
  }
  return value;
};

const buildDateFilter = (startDate, endDate) => {
  if (!startDate && !endDate) return undefined;
  const date = {};
  if (startDate) date.$gte = new Date(startDate);
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    date.$lte = end;
  }
  return date;
};

const safeUser = (user) =>
  user
    ? {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
      }
    : null;

const numericFields = [
  "mood",
  "energyLevel",
  "stressLevel",
  "sleepHours",
  "sleepQuality",
  "waterIntakeLiters",
  "steps",
  "exerciseMinutes",
  "yogaMinutes",
  "meditationMinutes",
  "weightKg",
];

export const listProgress = async ({
  page = 1,
  limit = 30,
  userId,
  startDate,
  endDate,
  sortOrder = "desc",
}) => {
  const filter = {};
  if (userId) filter.user = ensureObjectId(userId, "userId");
  const date = buildDateFilter(startDate, endDate);
  if (date) filter.date = date;
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);
  const [entries, total] = await Promise.all([
    Progress.find(filter)
      .sort({ date: sortOrder === "asc" ? 1 : -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),
    Progress.countDocuments(filter),
  ]);
  const ids = [
    ...new Set(entries.map((x) => x.user?.toString()).filter(Boolean)),
  ];
  const users = ids.length
    ? await User.find({ _id: { $in: ids } })
        .select("firstName lastName email isActive")
        .lean()
    : [];
  const map = new Map(users.map((u) => [u._id.toString(), u]));
  return {
    entries: entries.map((e) => ({
      ...e,
      user: safeUser(map.get(e.user?.toString())) || { id: e.user },
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

export const getProgress = async (id) => {
  ensureObjectId(id, "progress id");
  const entry = await Progress.findById(id).lean();
  if (!entry) {
    const e = new Error("Progress entry not found");
    e.statusCode = 404;
    throw e;
  }
  const user = await User.findById(entry.user)
    .select("firstName lastName email isActive createdAt")
    .lean();
  return { progress: entry, user: safeUser(user) };
};

const avg = (rows, field) => {
  const values = rows.map((r) => r[field]).filter((v) => typeof v === "number");
  return values.length
    ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
    : null;
};
const total = (rows, field) =>
  rows.reduce((s, r) => s + (typeof r[field] === "number" ? r[field] : 0), 0);

export const getProgressStats = async ({ userId, startDate, endDate } = {}) => {
  const filter = {};
  if (userId) filter.user = ensureObjectId(userId, "userId");
  const date = buildDateFilter(startDate, endDate);
  if (date) filter.date = date;
  const [entries, totalEntries, trackedUsers, latest] = await Promise.all([
    Progress.find(filter).sort({ date: 1 }).limit(366).lean(),
    Progress.countDocuments(filter),
    Progress.distinct("user", filter),
    Progress.find(filter).sort({ date: -1 }).limit(1).lean(),
  ]);
  return {
    period: { startDate: startDate || null, endDate: endDate || null },
    totals: { entries: totalEntries, trackedUsers: trackedUsers.length },
    averages: Object.fromEntries(
      numericFields.map((f) => [f, avg(entries, f)]),
    ),
    activityTotals: {
      exerciseMinutes: total(entries, "exerciseMinutes"),
      yogaMinutes: total(entries, "yogaMinutes"),
      meditationMinutes: total(entries, "meditationMinutes"),
      steps: total(entries, "steps"),
    },
    latestEntry: latest[0] || null,
  };
};

export const getUserWellness = async (userId, startDate, endDate) => {
  ensureObjectId(userId, "userId");
  const user = await User.findById(userId)
    .select("firstName lastName email isActive createdAt")
    .lean();
  if (!user) {
    const e = new Error("User not found");
    e.statusCode = 404;
    throw e;
  }
  const date = buildDateFilter(startDate, endDate);
  const filter = { user: userId };
  if (date) filter.date = date;
  const entries = await Progress.find(filter)
    .sort({ date: 1 })
    .limit(366)
    .lean();
  return {
    user: safeUser(user),
    period: { startDate: startDate || null, endDate: endDate || null },
    summary: {
      daysTracked: entries.length,
      averages: Object.fromEntries(
        numericFields.map((f) => [f, avg(entries, f)]),
      ),
      totals: {
        exerciseMinutes: total(entries, "exerciseMinutes"),
        yogaMinutes: total(entries, "yogaMinutes"),
        meditationMinutes: total(entries, "meditationMinutes"),
        steps: total(entries, "steps"),
      },
    },
    entries,
  };
};

export const updateProgress = async (id, data) => {
  ensureObjectId(id, "progress id");
  const update = { ...data };
  if (update.date) {
    const d = new Date(update.date);
    d.setHours(0, 0, 0, 0);
    update.date = d;
  }
  const entry = await Progress.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true },
  ).lean();
  if (!entry) {
    const e = new Error("Progress entry not found");
    e.statusCode = 404;
    throw e;
  }
  return entry;
};

export const deleteProgress = async (id) => {
  ensureObjectId(id, "progress id");
  const entry = await Progress.findByIdAndDelete(id);
  if (!entry) {
    const e = new Error("Progress entry not found");
    e.statusCode = 404;
    throw e;
  }
  return { id: entry._id, message: "Progress entry deleted successfully" };
};
