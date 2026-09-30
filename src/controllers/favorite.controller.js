import {
  createFavorite,
  getFavorites,
  getFavoriteById,
  checkFavorite,
  removeFavoriteById,
  removeFavorite,
  removeFavoritesByType,
} from "../services/favorite.service.js";

export const create = async (req, res, next) => {
  try {
    const favorite = await createFavorite(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Item added to favorites",
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { itemType, page = 1, limit = 20 } = req.query;

    const result = await getFavorites({
      userId: req.user._id,
      itemType,
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

export const getOne = async (req, res, next) => {
  try {
    const favorite = await getFavoriteById(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

export const check = async (req, res, next) => {
  try {
    const result = await checkFavorite(
      req.user._id,
      req.params.itemType,
      req.params.itemId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await removeFavoriteById(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Favorite removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const removeByItem = async (req, res, next) => {
  try {
    await removeFavorite(req.user._id, req.params.itemType, req.params.itemId);

    res.status(200).json({
      success: true,
      message: "Favorite removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const removeByType = async (req, res, next) => {
  try {
    const result = await removeFavoritesByType(
      req.user._id,
      req.params.itemType,
    );

    res.status(200).json({
      success: true,
      message: "Favorites removed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
