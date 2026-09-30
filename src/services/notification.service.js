import mongoose from "mongoose";
import Notification from "../models/notification.model.js";

export const createNotification = async (userId, data) => {
  const notification = await Notification.create({
    user: userId,
    ...data,
  });

  return notification.toObject();
};

export const getNotifications = async ({
  userId,
  page = 1,
  limit = 20,
  type,
  read,
}) => {
  const filter = {
    user: userId,
  };

  if (type) {
    filter.type = type;
  }

  if (read !== undefined) {
    filter.isRead = read;
  }

  filter.$or = [
    {
      expiresAt: null,
    },
    {
      expiresAt: {
        $gt: new Date(),
      },
    },
  ];

  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Notification.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    notifications,

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

export const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({
    user: userId,
    isRead: false,
    $or: [
      {
        expiresAt: null,
      },
      {
        expiresAt: {
          $gt: new Date(),
        },
      },
    ],
  });

  return count;
};

export const getNotificationById = async (userId, notificationId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    const error = new Error("Invalid notification ID");

    error.statusCode = 400;

    throw error;
  }

  const notification = await Notification.findOne({
    _id: notificationId,
    user: userId,
  }).lean();

  if (!notification) {
    const error = new Error("Notification not found");

    error.statusCode = 404;

    throw error;
  }

  return notification;
};

export const markNotificationAsRead = async (userId, notificationId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    const error = new Error("Invalid notification ID");

    error.statusCode = 400;

    throw error;
  }

  const notification = await Notification.findOne({
    _id: notificationId,
    user: userId,
  });

  if (!notification) {
    const error = new Error("Notification not found");

    error.statusCode = 404;

    throw error;
  }

  notification.isRead = true;
  notification.readAt = new Date();

  await notification.save();

  return notification.toObject();
};

export const markAllNotificationsAsRead = async (userId) => {
  const result = await Notification.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );

  return {
    modifiedCount: result.modifiedCount,
  };
};

export const deleteNotification = async (userId, notificationId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    const error = new Error("Invalid notification ID");

    error.statusCode = 400;

    throw error;
  }

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });

  if (!notification) {
    const error = new Error("Notification not found");

    error.statusCode = 404;

    throw error;
  }

  return notification.toObject();
};

export const deleteReadNotifications = async (userId) => {
  const result = await Notification.deleteMany({
    user: userId,
    isRead: true,
  });

  return {
    deletedCount: result.deletedCount,
  };
};
