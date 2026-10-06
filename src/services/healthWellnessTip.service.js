import mongoose from "mongoose";

import HealthWellnessTip from "../models/healthWellnessTip.model.js";

function createServiceError(
  message,
  statusCode = 400,
  code = "HEALTH_WELLNESS_TIP_ERROR",
) {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.code = code;

  return error;
}

function assertObjectId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw createServiceError(
      "Invalid health and wellness tip ID.",
      400,
      "INVALID_HEALTH_WELLNESS_TIP_ID",
    );
  }
}

function activeFilter(now) {
  return {
    isActive: true,
    startDate: {
      $lte: now,
    },
    $or: [
      {
        endDate: null,
      },
      {
        endDate: {
          $gte: now,
        },
      },
    ],
  };
}

export async function getActiveHealthWellnessTips({
  category = "",
  type = "",
  featured,
  search = "",
  page = 1,
  limit = 20,
} = {}) {
  const now = new Date();

  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  const filter = activeFilter(now);

  if (category) {
    filter.category = category;
  }

  if (type) {
    filter.type = type;
  }

  if (featured === true) {
    filter.featured = true;
  }

  if (search?.trim()) {
    const searchRegex = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );

    filter.$and = [
      activeFilter(now),
      {
        $or: [
          {
            title: searchRegex,
          },
          {
            shortDescription: searchRegex,
          },
          {
            tags: searchRegex,
          },
        ],
      },
    ];

    delete filter.isActive;
    delete filter.startDate;
    delete filter.endDate;
    delete filter.$or;
  }

  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    HealthWellnessTip.find(filter)
      .sort({
        featured: -1,
        priority: -1,
        startDate: -1,
      })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    HealthWellnessTip.countDocuments(filter),
  ]);

  const pages = Math.max(Math.ceil(total / safeLimit), 1);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages,
      hasNextPage: safePage < pages,
      hasPreviousPage: safePage > 1,
    },
  };
}

export async function getActiveHealthWellnessTipById(id) {
  assertObjectId(id);

  const now = new Date();

  const item = await HealthWellnessTip.findOne({
    _id: id,
    ...activeFilter(now),
  }).lean();

  if (!item) {
    throw createServiceError(
      "Health and wellness tip not found.",
      404,
      "HEALTH_WELLNESS_TIP_NOT_FOUND",
    );
  }

  return item;
}

export async function getFeaturedHealthWellnessTips({ limit = 5 } = {}) {
  const now = new Date();

  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);

  return HealthWellnessTip.find({
    ...activeFilter(now),
    featured: true,
  })
    .sort({
      priority: -1,
      startDate: -1,
    })
    .limit(safeLimit)
    .lean();
}
