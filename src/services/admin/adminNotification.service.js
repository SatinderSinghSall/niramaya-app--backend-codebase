import mongoose from "mongoose";

import Notification from "../../models/notification.model.js";
import User from "../../models/user.model.js";

const ensureId = (id, label = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${label}`);
    error.statusCode = 400;
    throw error;
  }
};

const notFound = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  throw error;
};

const escapeRegex = (value) =>
  String(value)
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const notificationTypes = [
  "goal",
  "progress",
  "consultation",
  "yoga",
  "ayurveda",
  "general",
  "system",
];

const validateType = (type) => {
  if (type && !notificationTypes.includes(type)) {
    const error = new Error(
      `Invalid notification type. Allowed: ${notificationTypes.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }
};

export const listAdminNotifications = async ({
  page = 1,
  limit = 20,
  search,
  userId,
  type,
  read,
  includeExpired = false,
}) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const filter = {};
  validateType(type);

  if (userId) {
    ensureId(userId, "user ID");
    filter.user = userId;
  }

  if (type) filter.type = type;
  if (read !== undefined) filter.isRead = read;

  if (!includeExpired) {
    filter.$or = [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }];
  }

  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search), "i");
    filter.$and = [
      ...(filter.$and || []),
      { $or: [{ title: regex }, { message: regex }] },
    ];
  }

  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Notification.find(filter)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Notification.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / safeLimit);

  return {
    notifications: items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  };
};

export const getAdminNotificationById = async (id) => {
  ensureId(id, "notification ID");

  const notification = await Notification.findById(id)
    .populate("user", "firstName lastName email phone isActive")
    .lean();

  if (!notification) notFound("Notification not found");

  return notification;
};

export const getAdminNotificationStats = async () => {
  const [total, unread, grouped, recent] = await Promise.all([
    Notification.countDocuments(),
    Notification.countDocuments({ isRead: false }),
    Notification.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Notification.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "firstName lastName email")
      .lean(),
  ]);

  return {
    total,
    unread,
    byType: Object.fromEntries(
      grouped.map((item) => [item._id || "unknown", item.count]),
    ),
    recent,
  };
};

export const createAdminNotification = async ({
  userId,
  type = "general",
  title,
  message,
  action,
  metadata,
  expiresAt,
}) => {
  ensureId(userId, "user ID");
  validateType(type);

  const user = await User.findById(userId).select("_id isActive").lean();
  if (!user) notFound("User not found");

  const notification = await Notification.create({
    user: user._id,
    type,
    title,
    message,
    action,
    metadata,
    expiresAt,
  });

  return getAdminNotificationById(notification._id);
};

export const createAdminNotificationsBulk = async ({
  userIds,
  type = "general",
  title,
  message,
  action,
  metadata,
  expiresAt,
}) => {
  validateType(type);

  if (!Array.isArray(userIds) || userIds.length === 0) {
    const error = new Error("At least one user ID is required");
    error.statusCode = 400;
    throw error;
  }

  if (userIds.length > 100) {
    const error = new Error(
      "Bulk notification is limited to 100 users per request",
    );
    error.statusCode = 400;
    throw error;
  }

  const uniqueIds = [...new Set(userIds.map(String))];
  uniqueIds.forEach((id) => ensureId(id, "user ID"));

  const users = await User.find({
    _id: { $in: uniqueIds },
  })
    .select("_id isActive")
    .lean();

  if (!users.length) notFound("No matching users found");

  const docs = users.map((user) => ({
    user: user._id,
    type,
    title,
    message,
    action,
    metadata,
    expiresAt,
  }));

  const created = await Notification.insertMany(docs);

  return {
    requested: uniqueIds.length,
    created: created.length,
  };
};

export const markAdminNotificationRead = async (id, isRead = true) => {
  ensureId(id, "notification ID");

  const notification = await Notification.findByIdAndUpdate(
    id,
    {
      $set: {
        isRead,
        readAt: isRead ? new Date() : null,
      },
    },
    { new: true, runValidators: true },
  );

  if (!notification) notFound("Notification not found");

  return getAdminNotificationById(id);
};

export const deleteAdminNotification = async (id) => {
  ensureId(id, "notification ID");

  const result = await Notification.deleteOne({ _id: id });

  if (!result.deletedCount) notFound("Notification not found");

  return { deleted: true };
};

export const deleteAdminReadNotifications = async () => {
  const result = await Notification.deleteMany({ isRead: true });

  return {
    deletedCount: result.deletedCount,
  };
};
