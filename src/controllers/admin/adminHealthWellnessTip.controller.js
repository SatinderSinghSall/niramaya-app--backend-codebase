import {
  createHealthWellnessTip,
  deleteHealthWellnessTip,
  getHealthWellnessTipById,
  getHealthWellnessTips,
  updateHealthWellnessTip,
} from "../../services/admin/adminHealthWellnessTip.service.js";

function sendSuccess(res, data, message = null) {
  return res.status(200).json({
    success: true,
    data,
    ...(message ? { message } : {}),
  });
}

export async function getHealthWellnessTipsController(req, res, next) {
  try {
    const result = await getHealthWellnessTips({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      category: req.query.category,
      type: req.query.type,
      difficulty: req.query.difficulty,
      status: req.query.status,
      featured:
        req.query.featured === undefined
          ? undefined
          : req.query.featured === "true",
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    });

    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getHealthWellnessTipController(req, res, next) {
  try {
    const item = await getHealthWellnessTipById(req.params.id);

    return sendSuccess(res, item);
  } catch (error) {
    next(error);
  }
}

export async function createHealthWellnessTipController(req, res, next) {
  try {
    const item = await createHealthWellnessTip(req.body);

    return res.status(201).json({
      success: true,
      data: item,
      message: "Health and wellness content created successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateHealthWellnessTipController(req, res, next) {
  try {
    const item = await updateHealthWellnessTip(req.params.id, req.body);

    return sendSuccess(
      res,
      item,
      "Health and wellness content updated successfully.",
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteHealthWellnessTipController(req, res, next) {
  try {
    const item = await deleteHealthWellnessTip(req.params.id);

    return sendSuccess(
      res,
      item,
      "Health and wellness content deleted successfully.",
    );
  } catch (error) {
    next(error);
  }
}
