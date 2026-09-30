import { searchContent } from "../services/search.service.js";

export const search = async (req, res, next) => {
  try {
    const {
      q,
      type = "all",
      category,
      difficulty,
      ayurvedaType,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await searchContent({
      query: q,
      type,

      category,

      difficulty,

      ayurvedaType,

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
