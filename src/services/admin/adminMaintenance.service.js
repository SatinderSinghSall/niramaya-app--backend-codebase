import Maintenance from "../../models/maintenance.model.js";

const MAX_TITLE_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 1000;

const createError = (message, statusCode, code) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.code = code;

  return error;
};

const validateBoolean = (value, fieldName) => {
  if (value !== undefined && typeof value !== "boolean") {
    throw createError(
      `${fieldName} must be a boolean.`,
      400,
      "INVALID_MAINTENANCE_FIELD",
    );
  }
};

const validateDate = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw createError(
      `${fieldName} must be a valid date.`,
      400,
      "INVALID_MAINTENANCE_DATE",
    );
  }

  return date;
};

const validatePayload = (payload, existingConfig = null) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw createError(
      "A valid maintenance configuration object is required.",
      400,
      "INVALID_MAINTENANCE_CONFIG",
    );
  }

  const allowedFields = [
    "enabled",
    "title",
    "message",
    "allowUserAccess",
    "startDate",
    "endDate",
  ];

  const unknownFields = Object.keys(payload).filter(
    (field) => !allowedFields.includes(field),
  );

  if (unknownFields.length) {
    throw createError(
      `Unsupported maintenance fields: ${unknownFields.join(", ")}.`,
      400,
      "INVALID_MAINTENANCE_FIELDS",
    );
  }

  const data = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      data[field] = payload[field];
    }
  }

  /*
   * Resolve final values so validation works for
   * partial updates as well.
   */

  const enabled = data.enabled ?? existingConfig?.enabled ?? false;

  const title =
    data.title ?? existingConfig?.title ?? "Maintenance in Progress";

  const message =
    data.message ??
    existingConfig?.message ??
    "Niramaya is currently undergoing maintenance. We appreciate your patience.";

  const allowUserAccess =
    data.allowUserAccess ?? existingConfig?.allowUserAccess ?? true;

  const startDateInput =
    data.startDate !== undefined ? data.startDate : existingConfig?.startDate;

  const endDateInput =
    data.endDate !== undefined ? data.endDate : existingConfig?.endDate;

  /*
   * Boolean validation
   */

  validateBoolean(data.enabled, "enabled");

  validateBoolean(data.allowUserAccess, "allowUserAccess");

  /*
   * Title validation
   */

  if (typeof title !== "string" || !title.trim()) {
    throw createError(
      "Maintenance title is required.",
      400,
      "INVALID_MAINTENANCE_TITLE",
    );
  }

  if (title.trim().length > MAX_TITLE_LENGTH) {
    throw createError(
      `Maintenance title cannot exceed ${MAX_TITLE_LENGTH} characters.`,
      400,
      "INVALID_MAINTENANCE_TITLE",
    );
  }

  /*
   * Message validation
   */

  if (typeof message !== "string" || !message.trim()) {
    throw createError(
      "Maintenance message is required.",
      400,
      "INVALID_MAINTENANCE_MESSAGE",
    );
  }

  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    throw createError(
      `Maintenance message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`,
      400,
      "INVALID_MAINTENANCE_MESSAGE",
    );
  }

  /*
   * Date validation
   */

  const startDate = validateDate(startDateInput, "startDate");

  const endDate = validateDate(endDateInput, "endDate");

  if (startDate && endDate && endDate <= startDate) {
    throw createError(
      "End date must be later than the start date.",
      400,
      "INVALID_MAINTENANCE_WINDOW",
    );
  }

  /*
   * Normalize strings.
   */

  data.title = title.trim();
  data.message = message.trim();

  if (data.enabled !== undefined) {
    data.enabled = Boolean(data.enabled);
  }

  if (data.allowUserAccess !== undefined) {
    data.allowUserAccess = Boolean(data.allowUserAccess);
  }

  /*
   * Store normalized Date objects.
   */

  if (data.startDate !== undefined) {
    data.startDate = startDate;
  }

  if (data.endDate !== undefined) {
    data.endDate = endDate;
  }

  return data;
};

/*
 * Get the maintenance configuration.
 *
 * There should normally be only one document.
 */
export const getMaintenanceConfig = async () => {
  return Maintenance.findOne().sort({ createdAt: 1 }).lean();
};

/*
 * Create the initial maintenance configuration.
 *
 * Only one configuration is allowed.
 */
export const createMaintenanceConfig = async (payload) => {
  const existing = await Maintenance.findOne();

  if (existing) {
    throw createError(
      "Maintenance configuration already exists.",
      409,
      "MAINTENANCE_CONFIG_EXISTS",
    );
  }

  const data = validatePayload(payload);

  const config = await Maintenance.create(data);

  return config.toObject();
};

/*
 * Update the existing maintenance configuration.
 */
export const updateMaintenanceConfig = async (payload) => {
  const config = await Maintenance.findOne();

  if (!config) {
    throw createError(
      "Maintenance configuration not found.",
      404,
      "MAINTENANCE_CONFIG_NOT_FOUND",
    );
  }

  const data = validatePayload(payload, config);

  Object.assign(config, data);

  await config.save();

  return config.toObject();
};

/*
 * Get the maintenance state that should be
 * consumed by the mobile application.
 */
export const getMobileMaintenanceConfig = async () => {
  const config = await Maintenance.findOne().sort({ createdAt: 1 }).lean();

  /*
   * No configuration means the application
   * should continue normally.
   */
  if (!config) {
    return {
      configured: false,
      active: false,
      enabled: false,
      allowUserAccess: true,
      title: null,
      message: null,
      startDate: null,
      endDate: null,
    };
  }

  const now = new Date();

  const startsAt = config.startDate ? new Date(config.startDate) : null;

  const endsAt = config.endDate ? new Date(config.endDate) : null;

  /*
   * Maintenance must be enabled first.
   */
  let active = Boolean(config.enabled);

  /*
   * If a start date exists and the
   * maintenance window hasn't started,
   * maintenance is not active.
   */
  if (active && startsAt && now < startsAt) {
    active = false;
  }

  /*
   * If an end date exists and the
   * maintenance window has expired,
   * maintenance is not active.
   */
  if (active && endsAt && now >= endsAt) {
    active = false;
  }

  return {
    configured: true,

    active,

    enabled: Boolean(config.enabled),

    allowUserAccess: Boolean(config.allowUserAccess),

    title: config.title,

    message: config.message,

    startDate: config.startDate,

    endDate: config.endDate,
  };
};

export const deleteMaintenanceConfig = async () => {
  const existing = await Maintenance.findOne().sort({
    createdAt: 1,
  });

  if (!existing) {
    const error = new Error("Maintenance configuration does not exist.");

    error.statusCode = 404;

    throw error;
  }

  await Maintenance.deleteOne({
    _id: existing._id,
  });

  return {
    deleted: true,
    id: existing._id,
  };
};
