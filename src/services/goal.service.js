import Goal from "../models/goal.model.js";

export const createGoal = async (userId, goalData) => {
  const goal = await Goal.create({
    user: userId,
    ...goalData,
  });

  return goal;
};

export const getUserGoals = async (userId, filters = {}) => {
  const query = {
    user: userId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  return Goal.find(query).sort({
    createdAt: -1,
  });
};

export const getGoalById = async (userId, goalId) => {
  return Goal.findOne({
    _id: goalId,
    user: userId,
  });
};

export const updateGoal = async (userId, goalId, goalData) => {
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  });

  if (!goal) {
    const error = new Error("Goal not found");
    error.statusCode = 404;
    throw error;
  }

  if (goal.status === "completed" || goal.status === "cancelled") {
    const error = new Error("Completed or cancelled goals cannot be updated");

    error.statusCode = 400;

    throw error;
  }

  Object.assign(goal, goalData);

  await goal.save();

  return goal;
};

export const deleteGoal = async (userId, goalId) => {
  const goal = await Goal.findOneAndDelete({
    _id: goalId,
    user: userId,
  });

  if (!goal) {
    const error = new Error("Goal not found");
    error.statusCode = 404;
    throw error;
  }

  return goal;
};

export const updateGoalProgress = async (
  userId,
  goalId,
  currentValue,
  progressPercentage,
) => {
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  });

  if (!goal) {
    const error = new Error("Goal not found");
    error.statusCode = 404;
    throw error;
  }

  if (goal.status === "completed" || goal.status === "cancelled") {
    const error = new Error("This goal can no longer receive progress updates");

    error.statusCode = 400;

    throw error;
  }

  goal.currentValue = currentValue;

  if (progressPercentage !== undefined) {
    goal.progressPercentage = progressPercentage;
  } else if (goal.target?.value && goal.target.value > 0) {
    const calculatedProgress = (currentValue / goal.target.value) * 100;

    goal.progressPercentage = Math.min(100, Math.max(0, calculatedProgress));
  }

  await goal.save();

  return goal;
};

export const completeGoal = async (userId, goalId) => {
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  });

  if (!goal) {
    const error = new Error("Goal not found");
    error.statusCode = 404;
    throw error;
  }

  goal.status = "completed";
  goal.progressPercentage = 100;
  goal.completedAt = new Date();

  await goal.save();

  return goal;
};

export const pauseGoal = async (userId, goalId) => {
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  });

  if (!goal) {
    const error = new Error("Goal not found");
    error.statusCode = 404;
    throw error;
  }

  if (goal.status !== "active") {
    const error = new Error("Only active goals can be paused");

    error.statusCode = 400;

    throw error;
  }

  goal.status = "paused";

  await goal.save();

  return goal;
};

export const resumeGoal = async (userId, goalId) => {
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  });

  if (!goal) {
    const error = new Error("Goal not found");
    error.statusCode = 404;
    throw error;
  }

  if (goal.status !== "paused") {
    const error = new Error("Only paused goals can be resumed");

    error.statusCode = 400;

    throw error;
  }

  goal.status = "active";

  await goal.save();

  return goal;
};
