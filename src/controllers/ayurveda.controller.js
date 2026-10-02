import {
  getAyurvedaItems,
  getAyurvedaItemById,
  getAyurvedaCategories,
  getFeaturedAyurveda,
  getPersonalizedAyurvedaRecommendations,
  incrementAyurvedaViewCount,
} from "../services/ayurveda.service.js";

export const getAllAyurveda = async (req, res, next) => {
  try {
    const {
      type,
      category,
      difficulty,
      dosha,
      featured,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await getAyurvedaItems({
      type,
      category,
      difficulty,
      dosha,
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

export const getAyurvedaById = async (req, res, next) => {
  try {
    const item = await getAyurvedaItemById(req.params.id);

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
    const categories = await getAyurvedaCategories();

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

    const items = await getFeaturedAyurveda(limit);

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
    const result = await getPersonalizedAyurvedaRecommendations(req.user._id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const incrementViewCount = async (req, res, next) => {
  try {
    const item = await incrementAyurvedaViewCount(req.params.id);

    res.status(200).json({
      success: true,
      data: {
        viewCount: item.viewCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
