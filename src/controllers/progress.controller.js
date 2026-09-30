import {
  createProgress,
  getProgressById,
  getProgressHistory,
  updateProgress,
  deleteProgress,
  getProgressSummary,
} from "../services/progress.service.js";

export const create = async (req, res, next) => {
  try {
    const progress = await createProgress(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Progress recorded successfully",
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { startDate, endDate, page = 1, limit = 30 } = req.query;

    const result = await getProgressHistory({
      userId: req.user._id,
      startDate,
      endDate,
      page: Math.max(Number(page) || 1, 1),
      limit: Math.min(Math.max(Number(limit) || 30, 1), 100),
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
    const progress = await getProgressById(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const progress = await updateProgress(
      req.user._id,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await deleteProgress(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const summary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const result = await getProgressSummary(req.user._id, startDate, endDate);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
