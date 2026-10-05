import * as service from "../../services/admin/adminGoal.service.js";
import {
  adminGoalQuerySchema,
  adminGoalStatusSchema,
  adminGoalProgressSchema,
} from "../../utils/adminWellness.validation.js";

export const list = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await service.listGoals(adminGoalQuerySchema.parse(req.query)),
    });
  } catch (e) {
    next(e);
  }
};
export const stats = async (req, res, next) => {
  try {
    res.json({ success: true, data: await service.getGoalStats() });
  } catch (e) {
    next(e);
  }
};
export const getOne = async (req, res, next) => {
  try {
    res.json({ success: true, data: await service.getGoal(req.params.id) });
  } catch (e) {
    next(e);
  }
};
export const updateStatus = async (req, res, next) => {
  try {
    const body = adminGoalStatusSchema.parse(req.body);
    res.json({
      success: true,
      message: "Goal status updated successfully",
      data: await service.updateGoalStatus(
        req.params.id,
        body.status,
        body.reason,
      ),
    });
  } catch (e) {
    next(e);
  }
};
export const updateProgress = async (req, res, next) => {
  try {
    const body = adminGoalProgressSchema.parse(req.body);
    res.json({
      success: true,
      message: "Goal progress updated successfully",
      data: await service.updateGoalProgress(
        req.params.id,
        body.currentValue,
        body.progressPercentage,
      ),
    });
  } catch (e) {
    next(e);
  }
};
