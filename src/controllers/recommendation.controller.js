import { getRecommendations } from "../services/recommendation.service.js";

export const getUserRecommendations = async (req, res, next) => {
  try {
    const { type = "all", limit = 10 } = req.query;

    const result = await getRecommendations({
      userId: req.user._id,
      type,
      limit,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
