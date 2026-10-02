import Yoga from "../models/yoga.model.js";
import HealthProfile from "../models/healthProfile.model.js";
import Goal from "../models/goal.model.js";

export const getYogaItems = async ({
  type,
  category,
  difficulty,
  featured,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = {
    isActive: true,
  };

  // ─────────────────────────
  // FILTERS
  // ─────────────────────────

  if (type) {
    filter.type = type;
  }

  if (category) {
    filter.category = category;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (featured === true) {
    filter.isFeatured = true;
  }

  // ─────────────────────────
  // SEARCH
  // ─────────────────────────

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        tags: {
          $regex: search,
          $options: "i",
        },
      },
      {
        bodyFocus: {
          $regex: search,
          $options: "i",
        },
      },
      {
        equipment: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // ─────────────────────────
  // PAGINATION
  // ─────────────────────────

  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const skip = (currentPage - 1) * currentLimit;

  const [items, total] = await Promise.all([
    Yoga.find(filter)
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    Yoga.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / currentLimit);

  return {
    items,

    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};

// ─────────────────────────
// GET YOGA BY ID
// ─────────────────────────

export const getYogaItemById = async (id) => {
  const item = await Yoga.findOne({
    _id: id,
    isActive: true,
  }).lean();

  if (!item) {
    const error = new Error("Yoga item not found");
    error.statusCode = 404;
    throw error;
  }

  return item;
};

// ─────────────────────────
// INCREMENT VIEW COUNT
// ─────────────────────────

export const incrementYogaViewCount = async (id) => {
  const item = await Yoga.findOneAndUpdate(
    {
      _id: id,
      isActive: true,
    },
    {
      $inc: {
        viewCount: 1,
      },
    },
    {
      new: true,
    },
  ).lean();

  if (!item) {
    const error = new Error("Yoga item not found");
    error.statusCode = 404;
    throw error;
  }

  return item;
};

// ─────────────────────────
// GET YOGA CATEGORIES
// ─────────────────────────

export const getYogaCategories = async () => {
  const categories = await Yoga.aggregate([
    {
      $match: {
        isActive: true,
      },
    },
    {
      $group: {
        _id: "$category",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  return categories.map((category) => ({
    category: category._id,
    count: category.count,
  }));
};

// ─────────────────────────
// GET FEATURED YOGA
// ─────────────────────────

export const getFeaturedYoga = async (limit = 10) => {
  const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  return Yoga.find({
    isActive: true,
    isFeatured: true,
  })
    .sort({
      createdAt: -1,
    })
    .limit(currentLimit)
    .lean();
};

// ─────────────────────────
// PERSONALIZED YOGA
// RECOMMENDATIONS
// ─────────────────────────

export const getPersonalizedYogaRecommendations = async (userId) => {
  const [healthProfile, goals] = await Promise.all([
    HealthProfile.findOne({
      user: userId,
    }).lean(),

    Goal.find({
      user: userId,
      status: "active",
    }).lean(),
  ]);

  // ─────────────────────────
  // HEALTH PROFILE REQUIRED
  // ─────────────────────────

  if (!healthProfile) {
    return {
      profileAvailable: false,
      message:
        "Complete your health profile to receive personalized Yoga recommendations.",
      recommendations: [],
    };
  }

  // ─────────────────────────
  // USER PROFILE DATA
  // ─────────────────────────

  const energyLevel = healthProfile.physicalHealth?.energyLevel;

  const stressLevel = healthProfile.wellbeing?.stressLevel;

  const sleepQuality = healthProfile.sleep?.sleepQuality;

  const activityLevel = healthProfile.lifestyle?.activityLevel;

  const yogaExperience = healthProfile.fitness?.yogaExperience;

  // ─────────────────────────
  // USER CONCERNS
  // ─────────────────────────

  const concerns = [
    ...(healthProfile.physicalHealth?.skinConcerns || []),
    ...(healthProfile.physicalHealth?.hairConcerns || []),
    ...(healthProfile.physicalHealth?.bodyPainAreas || []),
    ...(healthProfile.physicalHealth?.otherConcerns
      ? [healthProfile.physicalHealth.otherConcerns]
      : []),
  ]
    .filter(Boolean)
    .map((item) => item.toLowerCase().trim());

  // ─────────────────────────
  // USER GOALS
  // ─────────────────────────

  const goalCategories = goals
    .map((goal) => goal.category)
    .filter(Boolean)
    .map((category) => category.toLowerCase().trim());

  // ─────────────────────────
  // GET ACTIVE YOGA CONTENT
  // ─────────────────────────

  const items = await Yoga.find({
    isActive: true,
  }).lean();

  const scores = new Map();

  // ─────────────────────────
  // SCORE EACH YOGA ITEM
  // ─────────────────────────

  for (const item of items) {
    let score = 0;

    const recommendation = item.recommendedFor || {};

    // Energy level
    if (energyLevel && recommendation.energyLevels?.includes(energyLevel)) {
      score += 3;
    }

    // Stress level
    if (stressLevel && recommendation.stressLevels?.includes(stressLevel)) {
      score += 4;
    }

    // Sleep quality
    if (sleepQuality && recommendation.sleepQualities?.includes(sleepQuality)) {
      score += 4;
    }

    // Activity level
    if (
      activityLevel &&
      recommendation.activityLevels?.includes(activityLevel)
    ) {
      score += 2;
    }

    // Yoga experience
    if (
      yogaExperience &&
      recommendation.yogaExperience?.includes(yogaExperience)
    ) {
      score += 3;
    }

    // User concerns
    for (const concern of concerns) {
      if (recommendation.concerns?.includes(concern)) {
        score += 4;
      }

      if (item.tags?.some((tag) => tag.toLowerCase() === concern)) {
        score += 2;
      }

      if (
        item.bodyFocus?.some((bodyPart) => bodyPart.toLowerCase() === concern)
      ) {
        score += 2;
      }
    }

    // User goals
    for (const goalCategory of goalCategories) {
      if (recommendation.goalCategories?.includes(goalCategory)) {
        score += 5;
      }
    }

    // Featured content gets a small ranking boost
    if (item.isFeatured) {
      score += 1;
    }

    // Only include items that have at least
    // one matching recommendation signal.
    if (score > 0) {
      scores.set(String(item._id), score);
    }
  }

  // ─────────────────────────
  // SORT + LIMIT
  // ─────────────────────────

  const recommendations = items
    .filter((item) => scores.has(String(item._id)))
    .sort((a, b) => {
      return scores.get(String(b._id)) - scores.get(String(a._id));
    })
    .slice(0, 10)
    .map((item) => ({
      ...item,
      recommendationScore: scores.get(String(item._id)),
    }));

  // ─────────────────────────
  // RESPONSE
  // ─────────────────────────

  return {
    profileAvailable: true,
    recommendations,
  };
};
