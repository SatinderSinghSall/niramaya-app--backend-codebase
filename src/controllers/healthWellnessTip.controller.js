import {
  getActiveHealthWellnessTipById,
  getActiveHealthWellnessTips,
  getFeaturedHealthWellnessTips,
} from "../services/healthWellnessTip.service.js";

export async function getActiveHealthWellnessTipsController(req, res, next) {
  try {
    const result = await getActiveHealthWellnessTips({
      category: req.query.category,
      type: req.query.type,
      featured:
        req.query.featured === undefined
          ? undefined
          : req.query.featured === "true",
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getActiveHealthWellnessTipController(req, res, next) {
  try {
    const item = await getActiveHealthWellnessTipById(req.params.id);

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedHealthWellnessTipsController(req, res, next) {
  try {
    const items = await getFeaturedHealthWellnessTips({
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
}
