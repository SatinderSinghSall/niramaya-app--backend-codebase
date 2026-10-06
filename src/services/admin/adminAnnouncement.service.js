import mongoose from "mongoose";
import Announcement from "../../models/announcement.model.js";

const ALLOWED_TYPES = ["info", "success", "warning", "feature"];

const normalizeString = (value) => {
  if (typeof value !== "string") return value;
  return value.trim();
};

const normalizeBoolean = (value, fieldName) => {
  if (typeof value !== "boolean") {
    throw new Error(`${fieldName} must be a boolean`);
  }

  return value;
};

const normalizeDate = (value, fieldName, { allowNull = false } = {}) => {
  if (value === null || value === undefined || value === "") {
    if (allowNull) return null;

    throw new Error(`${fieldName} is required`);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
};

const validateAction = (action) => {
  if (action === undefined || action === null) {
    return {
      enabled: false,
    };
  }

  if (typeof action !== "object" || Array.isArray(action)) {
    throw new Error("action must be an object");
  }

  const enabled =
    action.enabled === undefined
      ? false
      : normalizeBoolean(action.enabled, "action.enabled");

  if (!enabled) {
    return {
      enabled: false,
    };
  }

  const label = normalizeString(action.label);
  const route = normalizeString(action.route);

  if (!label) {
    throw new Error("action.label is required when action is enabled");
  }

  if (!route) {
    throw new Error("action.route is required when action is enabled");
  }

  if (label.length > 50) {
    throw new Error("action.label must not exceed 50 characters");
  }

  if (route.length > 200) {
    throw new Error("action.route must not exceed 200 characters");
  }

  return {
    enabled: true,
    label,
    route,
  };
};

const validateAnnouncementData = (data = {}) => {
  const title = normalizeString(data.title);
  const message = normalizeString(data.message);
  const type = data.type || "info";

  if (!title) {
    throw new Error("Title is required");
  }

  if (title.length > 120) {
    throw new Error("Title must not exceed 120 characters");
  }

  if (!message) {
    throw new Error("Message is required");
  }

  if (message.length > 1000) {
    throw new Error("Message must not exceed 1000 characters");
  }

  if (!ALLOWED_TYPES.includes(type)) {
    throw new Error(`Type must be one of: ${ALLOWED_TYPES.join(", ")}`);
  }

  const isActive =
    data.isActive === undefined
      ? true
      : normalizeBoolean(data.isActive, "isActive");

  const startDate = normalizeDate(data.startDate, "startDate");

  const endDate = normalizeDate(data.endDate, "endDate", {
    allowNull: true,
  });

  if (endDate && endDate <= startDate) {
    throw new Error("End date must be later than start date");
  }

  const action = validateAction(data.action);

  return {
    title,
    message,
    type,
    isActive,
    startDate,
    endDate,
    action,
  };
};

const ensureValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid announcement ID");
  }
};

export const getAnnouncements = async () => {
  return Announcement.find({})
    .sort({
      startDate: -1,
      createdAt: -1,
    })
    .lean();
};

export const getAnnouncementById = async (id) => {
  ensureValidId(id);

  return Announcement.findById(id).lean();
};

export const createAnnouncement = async (data) => {
  const payload = validateAnnouncementData(data);

  const announcement = await Announcement.create(payload);

  return announcement.toObject();
};

export const updateAnnouncement = async (id, data) => {
  ensureValidId(id);

  const existing = await Announcement.findById(id);

  if (!existing) {
    return null;
  }

  const payload = validateAnnouncementData({
    title: data.title ?? existing.title,
    message: data.message ?? existing.message,
    type: data.type ?? existing.type,
    isActive: data.isActive === undefined ? existing.isActive : data.isActive,
    startDate: data.startDate ?? existing.startDate,
    endDate: data.endDate === undefined ? existing.endDate : data.endDate,
    action: data.action ?? existing.action,
  });

  Object.assign(existing, payload);

  await existing.save();

  return existing.toObject();
};

export const deleteAnnouncement = async (id) => {
  ensureValidId(id);

  return Announcement.findByIdAndDelete(id).lean();
};
