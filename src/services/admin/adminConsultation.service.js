import mongoose from "mongoose";

import Consultation from "../../models/consultation.model.js";
import User from "../../models/user.model.js";
import Notification from "../../models/notification.model.js";

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

const getStatusValues = () =>
  Consultation.schema.path("status")?.enumValues || [];

const buildSearch = (value) => {
  const escaped = String(value)
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
};

export const listAdminConsultations = async ({
  page = 1,
  limit = 20,
  search,
  status,
  consultationType,
  dateFrom,
  dateTo,
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const filter = {};

  if (status) {
    if (getStatusValues().length && !getStatusValues().includes(status)) {
      const error = new Error(
        `Invalid consultation status. Allowed: ${getStatusValues().join(", ")}`,
      );
      error.statusCode = 400;
      throw error;
    }
    filter.status = status;
  }

  if (consultationType) filter.consultationType = consultationType;

  if (search?.trim()) {
    const regex = buildSearch(search);
    const matchingUsers = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    })
      .select("_id")
      .limit(200)
      .lean();

    filter.$or = [
      { concern: regex },
      { notes: regex },
      { preferredTime: regex },
      { user: { $in: matchingUsers.map((user) => user._id) } },
    ];
  }

  if (dateFrom || dateTo) {
    filter.preferredDate = {};
    if (dateFrom) filter.preferredDate.$gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      filter.preferredDate.$lte = end;
    }
  }

  const sortFields = new Set([
    "createdAt",
    "preferredDate",
    "preferredTime",
    "status",
    "consultationType",
  ]);

  const safeSortBy = sortFields.has(sortBy) ? sortBy : "createdAt";
  const direction = sortOrder === "asc" ? 1 : -1;
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Consultation.find(filter)
      .populate("user", "firstName lastName email phone isActive")
      .sort({ [safeSortBy]: direction })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Consultation.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / safeLimit);

  return {
    consultations: items,
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

export const getAdminConsultationById = async (id) => {
  ensureId(id, "consultation ID");

  const consultation = await Consultation.findById(id)
    .populate("user", "firstName lastName email phone isActive createdAt")
    .lean();

  if (!consultation) notFound("Consultation not found");

  return consultation;
};

export const getAdminConsultationStats = async () => {
  const [total, grouped, upcoming, recent] = await Promise.all([
    Consultation.countDocuments(),
    Consultation.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Consultation.countDocuments({
      preferredDate: { $gte: new Date() },
      status: { $nin: ["cancelled", "completed"] },
    }),
    Consultation.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "firstName lastName email")
      .lean(),
  ]);

  const byStatus = Object.fromEntries(
    grouped.map((item) => [item._id || "unknown", item.count]),
  );

  return {
    total,
    byStatus,
    upcoming,
    recent,
  };
};

export const updateAdminConsultationStatus = async ({
  id,
  status,
  cancellationReason,
}) => {
  ensureId(id, "consultation ID");

  const allowed = getStatusValues();
  if (allowed.length && !allowed.includes(status)) {
    const error = new Error(
      `Invalid consultation status. Allowed: ${allowed.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  const consultation = await Consultation.findById(id);
  if (!consultation) notFound("Consultation not found");

  if (consultation.status === "completed" && status !== "completed") {
    const error = new Error(
      "Completed consultation cannot move to another status",
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    status === "cancelled" &&
    !cancellationReason?.trim() &&
    !consultation.cancellationReason
  ) {
    const error = new Error(
      "Cancellation reason is required when cancelling a consultation",
    );
    error.statusCode = 400;
    throw error;
  }

  consultation.status = status;

  if (status === "cancelled") {
    consultation.cancellationReason =
      cancellationReason?.trim() || consultation.cancellationReason;
  }

  if (status === "completed") {
    consultation.completedAt = consultation.completedAt || new Date();
  }

  await consultation.save();

  return getAdminConsultationById(id);
};

export const rescheduleAdminConsultation = async ({
  id,
  preferredDate,
  preferredTime,
}) => {
  ensureId(id, "consultation ID");

  const consultation = await Consultation.findById(id);
  if (!consultation) notFound("Consultation not found");

  if (["cancelled", "completed"].includes(consultation.status)) {
    const error = new Error(
      `${consultation.status} consultation cannot be rescheduled`,
    );
    error.statusCode = 400;
    throw error;
  }

  if (preferredDate !== undefined)
    consultation.preferredDate = new Date(preferredDate);
  if (preferredTime !== undefined) consultation.preferredTime = preferredTime;

  if (getStatusValues().includes("rescheduled")) {
    consultation.status = "rescheduled";
  }

  await consultation.save();

  return getAdminConsultationById(id);
};

export const updateAdminConsultationNotes = async ({ id, notes }) => {
  ensureId(id, "consultation ID");

  const consultation = await Consultation.findByIdAndUpdate(
    id,
    { $set: { notes: notes ?? "" } },
    { new: true, runValidators: true },
  ).lean();

  if (!consultation) notFound("Consultation not found");

  return getAdminConsultationById(id);
};

export const notifyConsultationUser = async ({
  consultationId,
  type = "consultation",
  title,
  message,
  action,
  metadata,
  expiresAt,
}) => {
  ensureId(consultationId, "consultation ID");

  const consultation = await Consultation.findById(consultationId)
    .select("user")
    .lean();
  if (!consultation) notFound("Consultation not found");

  const notification = await Notification.create({
    user: consultation.user,
    type,
    title,
    message,
    action,
    metadata,
    expiresAt,
  });

  return notification.toObject();
};
