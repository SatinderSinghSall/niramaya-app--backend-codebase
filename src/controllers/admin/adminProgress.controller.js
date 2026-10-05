import * as service from "../../services/admin/adminProgress.service.js";
import {
  adminProgressQuerySchema,
  adminProgressUpdateSchema,
} from "../../utils/adminWellness.validation.js";

export const list = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await service.listProgress(
        adminProgressQuerySchema.parse(req.query),
      ),
    });
  } catch (e) {
    next(e);
  }
};
export const stats = async (req, res, next) => {
  try {
    const q = adminProgressQuerySchema
      .pick({ userId: true, startDate: true, endDate: true })
      .parse(req.query);
    res.json({ success: true, data: await service.getProgressStats(q) });
  } catch (e) {
    next(e);
  }
};
export const getOne = async (req, res, next) => {
  try {
    res.json({ success: true, data: await service.getProgress(req.params.id) });
  } catch (e) {
    next(e);
  }
};
export const userWellness = async (req, res, next) => {
  try {
    const q = adminProgressQuerySchema
      .pick({ startDate: true, endDate: true })
      .parse(req.query);
    res.json({
      success: true,
      data: await service.getUserWellness(
        req.params.userId,
        q.startDate,
        q.endDate,
      ),
    });
  } catch (e) {
    next(e);
  }
};
export const update = async (req, res, next) => {
  try {
    const body = adminProgressUpdateSchema.parse(req.body);
    res.json({
      success: true,
      message: "Progress entry updated successfully",
      data: await service.updateProgress(req.params.id, body),
    });
  } catch (e) {
    next(e);
  }
};
export const remove = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await service.deleteProgress(req.params.id),
    });
  } catch (e) {
    next(e);
  }
};
