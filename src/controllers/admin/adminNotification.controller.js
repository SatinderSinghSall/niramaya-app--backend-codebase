import {
  listAdminNotifications,
  getAdminNotificationById,
  getAdminNotificationStats,
  createAdminNotification,
  createAdminNotificationsBulk,
  markAdminNotificationRead,
  deleteAdminNotification,
  deleteAdminReadNotifications,
} from "../../services/admin/adminNotification.service.js";

export const list = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: await listAdminNotifications({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        userId: req.query.userId,
        type: req.query.type,
        read:
          req.query.read === undefined ? undefined : req.query.read === "true",
        includeExpired: req.query.includeExpired === "true",
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const stats = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: await getAdminNotificationStats(),
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: await getAdminNotificationById(req.params.id),
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: await createAdminNotification({
        userId: req.params.userId,
        ...req.body,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const createBulk = async (req, res, next) => {
  try {
    const { userIds, ...payload } = req.body;

    res.status(201).json({
      success: true,
      message: "Bulk notifications sent successfully",
      data: await createAdminNotificationsBulk({
        userIds,
        ...payload,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Notification read state updated",
      data: await markAdminNotificationRead(req.params.id, req.body.isRead),
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: await deleteAdminNotification(req.params.id),
    });
  } catch (error) {
    next(error);
  }
};

export const removeRead = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Read notifications deleted successfully",
      data: await deleteAdminReadNotifications(),
    });
  } catch (error) {
    next(error);
  }
};
