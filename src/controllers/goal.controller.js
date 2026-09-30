import {
  completeGoal,
  createGoal,
  deleteGoal,
  getGoalById,
  getUserGoals,
  pauseGoal,
  resumeGoal,
  updateGoal,
  updateGoalProgress,
} from "../services/goal.service.js";

export const create = async (req, res, next) => {
  try {
    const goal = await createGoal(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      data: {
        goal,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const goals = await getUserGoals(req.user._id, {
      status: req.query.status,
      category: req.query.category,
    });

    res.status(200).json({
      success: true,
      data: {
        goals,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const goal = await getGoalById(req.user._id, req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        goal,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const goal = await updateGoal(req.user._id, req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      data: {
        goal,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteGoal(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const goal = await updateGoalProgress(
      req.user._id,
      req.params.id,
      req.body.currentValue,
      req.body.progressPercentage,
    );

    res.status(200).json({
      success: true,
      message: "Goal progress updated successfully",
      data: {
        goal,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const complete = async (req, res, next) => {
  try {
    const goal = await completeGoal(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Goal completed successfully",
      data: {
        goal,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const pause = async (req, res, next) => {
  try {
    const goal = await pauseGoal(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Goal paused successfully",
      data: {
        goal,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resume = async (req, res, next) => {
  try {
    const goal = await resumeGoal(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Goal resumed successfully",
      data: {
        goal,
      },
    });
  } catch (error) {
    next(error);
  }
};
