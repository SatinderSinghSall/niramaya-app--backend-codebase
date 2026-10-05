import mongoose from "mongoose";
import User from "../../models/user.model.js";
import HealthProfile from "../../models/healthProfile.model.js";
import Goal from "../../models/goal.model.js";
import Progress from "../../models/progress.model.js";
import Consultation from "../../models/consultation.model.js";
import Notification from "../../models/notification.model.js";
import Favorite from "../../models/favorite.model.js";
import Settings from "../../models/settings.model.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function parseBoolean(value) {
  if (value === undefined || value === "") return undefined;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
}

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid user id");
    error.statusCode = 400;
    throw error;
  }
}

function sanitizeUser(user) {
  if (!user) return null;
  const source = user.toObject ? user.toObject() : user;

  return {
    id: source._id?.toString?.() || source.id,
    firstName: source.firstName,
    lastName: source.lastName,
    email: source.email,
    isActive: source.isActive,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

async function buildUserActivityCounts(userId) {
  const [
    healthProfile,
    goals,
    progress,
    consultations,
    notifications,
    favorites,
    settings,
  ] = await Promise.all([
    HealthProfile.exists({ user: userId }),
    Goal.countDocuments({ user: userId }),
    Progress.countDocuments({ user: userId }),
    Consultation.countDocuments({ user: userId }),
    Notification.countDocuments({ user: userId }),
    Favorite.countDocuments({ user: userId }),
    Settings.exists({ user: userId }),
  ]);

  return {
    hasHealthProfile: Boolean(healthProfile),
    goalCount: goals,
    progressCount: progress,
    consultationCount: consultations,
    notificationCount: notifications,
    favoriteCount: favorites,
    hasSettings: Boolean(settings),
  };
}

export async function listUsers({
  page = 1,
  limit = 25,
  search,
  isActive,
  sortBy = "createdAt",
  sortOrder = "desc",
}) {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 25, 1), 100);

  const filter = {};
  const active = parseBoolean(isActive);

  if (active !== undefined) {
    filter.isActive = active;
  }

  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }];
  }

  const safeSortFields = new Set([
    "createdAt",
    "updatedAt",
    "firstName",
    "lastName",
    "email",
  ]);

  if (!safeSortFields.has(sortBy)) sortBy = "createdAt";
  sortOrder = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshTokenHash")
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    items: users.map(sanitizeUser),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getUser(id) {
  validateId(id);

  const user = await User.findById(id)
    .select("-password -refreshTokenHash")
    .lean();

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const activity = await buildUserActivityCounts(id);

  return {
    ...sanitizeUser(user),
    activity,
  };
}

export async function getUserDetails(id) {
  validateId(id);

  const user = await User.findById(id)
    .select("-password -refreshTokenHash")
    .lean();

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const [
    healthProfile,
    goals,
    progress,
    consultations,
    notifications,
    favorites,
    settings,
  ] = await Promise.all([
    HealthProfile.findOne({ user: id }).lean(),
    Goal.find({ user: id }).sort({ createdAt: -1 }).lean(),
    Progress.find({ user: id })
      .sort({ date: -1, createdAt: -1 })
      .limit(100)
      .lean(),
    Consultation.find({ user: id })
      .sort({ scheduledAt: -1, createdAt: -1 })
      .limit(100)
      .lean(),
    Notification.find({ user: id }).sort({ createdAt: -1 }).limit(100).lean(),
    Favorite.find({ user: id }).sort({ createdAt: -1 }).limit(100).lean(),
    Settings.findOne({ user: id }).lean(),
  ]);

  return {
    user: sanitizeUser(user),
    healthProfile,
    goals,
    progress,
    consultations,
    notifications,
    favorites,
    settings,
  };
}

export async function updateUserStatus({ id, isActive }) {
  validateId(id);

  const user = await User.findById(id).select("_id isActive");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.isActive = Boolean(isActive);
  await user.save();

  return sanitizeUser(user);
}

export async function deleteUser({ id }) {
  validateId(id);

  const user = await User.findById(id).select("_id");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const session = await mongoose.startSession();

  try {
    let deleted;
    await session.withTransaction(async () => {
      const userFilter = { user: id };

      await Promise.all([
        HealthProfile.deleteMany(userFilter).session(session),
        Goal.deleteMany(userFilter).session(session),
        Progress.deleteMany(userFilter).session(session),
        Consultation.deleteMany(userFilter).session(session),
        Notification.deleteMany(userFilter).session(session),
        Favorite.deleteMany(userFilter).session(session),
        Settings.deleteMany(userFilter).session(session),
      ]);

      deleted = await User.deleteOne({ _id: id }).session(session);
    });

    return {
      id,
      deleted: deleted.deletedCount === 1,
    };
  } finally {
    await session.endSession();
  }
}
