import {
  getYogaItems,
  getYogaItemById,
  getYogaCategories,
  getFeaturedYoga,
  getPersonalizedYogaRecommendations,
} from "../services/yoga.service.js";

export const getAllYoga = async (req, res, next) => {
  try {
    const {
      type,
      category,
      difficulty,
      featured,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await getYogaItems({
      type,
      category,
      difficulty,
      featured: featured === "true",
      search,
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

export const getYogaById = async (req, res, next) => {
  try {
    const item = await getYogaItemById(req.params.id);

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getYogaCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 20);

    const items = await getFeaturedYoga(limit);

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const result = await getPersonalizedYogaRecommendations(req.user._id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
