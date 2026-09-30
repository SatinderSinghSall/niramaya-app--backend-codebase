import mongoose from "mongoose";

import Favorite from "../models/favorite.model.js";
import Ayurveda from "../models/ayurveda.model.js";
import Yoga from "../models/yoga.model.js";

const getModel = (itemType) => {
  if (itemType === "ayurveda") {
    return Ayurveda;
  }

  if (itemType === "yoga") {
    return Yoga;
  }

  const error = new Error("Invalid favorite item type");

  error.statusCode = 400;

  throw error;
};

const validateItem = async (itemType, itemId) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    const error = new Error("Invalid item ID");

    error.statusCode = 400;

    throw error;
  }

  const Model = getModel(itemType);

  const item = await Model.findOne({
    _id: itemId,
    isActive: true,
  }).lean();

  if (!item) {
    const error = new Error(`${itemType} item not found`);

    error.statusCode = 404;

    throw error;
  }

  return item;
};

export const createFavorite = async (userId, { itemType, itemId }) => {
  await validateItem(itemType, itemId);

  const existing = await Favorite.findOne({
    user: userId,
    itemType,
    item: itemId,
  }).lean();

  if (existing) {
    const error = new Error("Item is already in favorites");

    error.statusCode = 409;

    throw error;
  }

  try {
    const favorite = await Favorite.create({
      user: userId,
      itemType,
      item: itemId,
    });

    return favorite.toObject();
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error("Item is already in favorites");

      duplicateError.statusCode = 409;

      throw duplicateError;
    }

    throw error;
  }
};

export const getFavorites = async ({
  userId,
  itemType,
  page = 1,
  limit = 20,
}) => {
  const filter = {
    user: userId,
  };

  if (itemType) {
    filter.itemType = itemType;
  }

  const skip = (page - 1) * limit;

  const [favorites, total] = await Promise.all([
    Favorite.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Favorite.countDocuments(filter),
  ]);

  const enrichedFavorites = await Promise.all(
    favorites.map(async (favorite) => {
      const Model = getModel(favorite.itemType);

      const item = await Model.findOne({
        _id: favorite.item,
        isActive: true,
      }).lean();

      return {
        ...favorite,
        itemData: item || null,
      };
    }),
  );

  const totalPages = Math.ceil(total / limit);

  return {
    favorites: enrichedFavorites,

    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getFavoriteById = async (userId, favoriteId) => {
  if (!mongoose.Types.ObjectId.isValid(favoriteId)) {
    const error = new Error("Invalid favorite ID");

    error.statusCode = 400;

    throw error;
  }

  const favorite = await Favorite.findOne({
    _id: favoriteId,
    user: userId,
  }).lean();

  if (!favorite) {
    const error = new Error("Favorite not found");

    error.statusCode = 404;

    throw error;
  }

  const Model = getModel(favorite.itemType);

  const item = await Model.findOne({
    _id: favorite.item,
    isActive: true,
  }).lean();

  return {
    ...favorite,
    itemData: item || null,
  };
};

export const checkFavorite = async (userId, itemType, itemId) => {
  await validateItem(itemType, itemId);

  const favorite = await Favorite.findOne({
    user: userId,
    itemType,
    item: itemId,
  }).lean();

  return {
    isFavorite: Boolean(favorite),
    favoriteId: favorite?._id || null,
  };
};

export const removeFavoriteById = async (userId, favoriteId) => {
  if (!mongoose.Types.ObjectId.isValid(favoriteId)) {
    const error = new Error("Invalid favorite ID");

    error.statusCode = 400;

    throw error;
  }

  const favorite = await Favorite.findOneAndDelete({
    _id: favoriteId,
    user: userId,
  });

  if (!favorite) {
    const error = new Error("Favorite not found");

    error.statusCode = 404;

    throw error;
  }

  return favorite.toObject();
};

export const removeFavorite = async (userId, itemType, itemId) => {
  if (!["ayurveda", "yoga"].includes(itemType)) {
    const error = new Error("Invalid favorite item type");

    error.statusCode = 400;

    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    const error = new Error("Invalid item ID");

    error.statusCode = 400;

    throw error;
  }

  const favorite = await Favorite.findOneAndDelete({
    user: userId,
    itemType,
    item: itemId,
  });

  if (!favorite) {
    const error = new Error("Favorite not found");

    error.statusCode = 404;

    throw error;
  }

  return favorite.toObject();
};

export const removeFavoritesByType = async (userId, itemType) => {
  if (!["ayurveda", "yoga"].includes(itemType)) {
    const error = new Error("Invalid favorite item type");

    error.statusCode = 400;

    throw error;
  }

  const result = await Favorite.deleteMany({
    user: userId,
    itemType,
  });

  return {
    deletedCount: result.deletedCount,
  };
};
