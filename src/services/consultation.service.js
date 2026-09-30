import Consultation from "../models/consultation.model.js";

export const createConsultation = async (userId, data) => {
  const consultation = await Consultation.create({
    user: userId,
    ...data,
  });

  return consultation.toObject();
};

export const getConsultations = async ({
  userId,
  status,
  page = 1,
  limit = 20,
}) => {
  const filter = {
    user: userId,
  };

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [consultations, total] = await Promise.all([
    Consultation.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Consultation.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    consultations,

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

export const getConsultationById = async (userId, consultationId) => {
  const consultation = await Consultation.findOne({
    _id: consultationId,
    user: userId,
  }).lean();

  if (!consultation) {
    const error = new Error("Consultation not found");

    error.statusCode = 404;

    throw error;
  }

  return consultation;
};

export const updateConsultation = async (userId, consultationId, data) => {
  const consultation = await Consultation.findOne({
    _id: consultationId,
    user: userId,
  });

  if (!consultation) {
    const error = new Error("Consultation not found");

    error.statusCode = 404;

    throw error;
  }

  if (consultation.status === "cancelled") {
    const error = new Error("Cancelled consultation cannot be updated");

    error.statusCode = 400;

    throw error;
  }

  if (consultation.status === "completed") {
    const error = new Error("Completed consultation cannot be updated");

    error.statusCode = 400;

    throw error;
  }

  Object.assign(consultation, data);

  if (data.preferredDate || data.preferredTime) {
    consultation.status = "rescheduled";
  }

  await consultation.save();

  return consultation.toObject();
};

export const cancelConsultation = async (userId, consultationId, reason) => {
  const consultation = await Consultation.findOne({
    _id: consultationId,
    user: userId,
  });

  if (!consultation) {
    const error = new Error("Consultation not found");

    error.statusCode = 404;

    throw error;
  }

  if (consultation.status === "completed") {
    const error = new Error("Completed consultation cannot be cancelled");

    error.statusCode = 400;

    throw error;
  }

  if (consultation.status === "cancelled") {
    const error = new Error("Consultation is already cancelled");

    error.statusCode = 400;

    throw error;
  }

  consultation.status = "cancelled";

  consultation.cancellationReason = reason || null;

  await consultation.save();

  return consultation.toObject();
};

export const markConsultationCompleted = async (userId, consultationId) => {
  const consultation = await Consultation.findOne({
    _id: consultationId,
    user: userId,
  });

  if (!consultation) {
    const error = new Error("Consultation not found");

    error.statusCode = 404;

    throw error;
  }

  if (consultation.status === "cancelled") {
    const error = new Error("Cancelled consultation cannot be completed");

    error.statusCode = 400;

    throw error;
  }

  consultation.status = "completed";

  consultation.completedAt = new Date();

  await consultation.save();

  return consultation.toObject();
};
