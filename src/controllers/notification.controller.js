import {
  createNotification,
  getNotifications,
  getUnreadCount,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteReadNotifications,
} from "../services/notification.service.js";

export const create = async (req, res, next) => {
  try {
    const notification = await createNotification(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, read } = req.query;

    const result = await getNotifications({
      userId: req.user._id,
      page: Math.max(Number(page) || 1, 1),
      limit: Math.min(Math.max(Number(limit) || 20, 1), 50),
      type,
      read: read === undefined ? undefined : read === "true",
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnread = async (req, res, next) => {
  try {
    const count = await getUnreadCount(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        unreadCount: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const notification = await getNotificationById(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const notification = await markNotificationAsRead(
      req.user._id,
      req.params.id,
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    const result = await markAllNotificationsAsRead(req.user._id);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteNotification(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const removeRead = async (req, res, next) => {
  try {
    const result = await deleteReadNotifications(req.user._id);

    res.status(200).json({
      success: true,
      message: "Read notifications deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
