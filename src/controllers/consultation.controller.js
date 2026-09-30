import {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  cancelConsultation,
  markConsultationCompleted,
} from "../services/consultation.service.js";

export const create = async (req, res, next) => {
  try {
    const consultation = await createConsultation(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Consultation request created successfully",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const result = await getConsultations({
      userId: req.user._id,
      status,
      page: Math.max(Number(page) || 1, 1),
      limit: Math.min(Math.max(Number(limit) || 20, 1), 50),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const consultation = await getConsultationById(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const consultation = await updateConsultation(
      req.user._id,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Consultation updated successfully",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const consultation = await cancelConsultation(
      req.user._id,
      req.params.id,
      req.body.reason,
    );

    res.status(200).json({
      success: true,
      message: "Consultation cancelled successfully",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

export const complete = async (req, res, next) => {
  try {
    const consultation = await markConsultationCompleted(
      req.user._id,
      req.params.id,
    );

    res.status(200).json({
      success: true,
      message: "Consultation marked as completed",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};
