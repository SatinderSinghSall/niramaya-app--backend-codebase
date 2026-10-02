import Ayurveda from "../models/ayurveda.model.js";
import HealthProfile from "../models/healthProfile.model.js";
import Goal from "../models/goal.model.js";

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const addMatchValue = (set, value, amount) => {
  if (value) {
    set[value] = (set[value] || 0) + amount;
  }
};

// ------------------------------------------------------------
// Get Ayurveda items
// ------------------------------------------------------------

export const getAyurvedaItems = async ({
  type,
  category,
  difficulty,
  dosha,
  featured,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = {
    isActive: true,
  };

  if (type) {
    filter.type = type;
  }

  if (category) {
    filter.category = category;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (dosha) {
    filter.doshas = dosha;
  }

  if (featured === true) {
    filter.isFeatured = true;
  }

  if (search?.trim()) {
    const searchRegex = {
      $regex: escapeRegex(search.trim()),
      $options: "i",
    };

    filter.$or = [
      {
        title: searchRegex,
      },
      {
        shortDescription: searchRegex,
      },
      {
        description: searchRegex,
      },
      {
        tags: searchRegex,
      },
      {
        benefits: searchRegex,
      },
      {
        wellnessGoals: searchRegex,
      },
      {
        bodySystems: searchRegex,
      },
      {
        "ingredients.name": searchRegex,
      },
      {
        doshas: searchRegex,
      },
    ];
  }

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Ayurveda.find(filter)
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    Ayurveda.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / safeLimit);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  };
};

// ------------------------------------------------------------
// Get Ayurveda item by ID
// ------------------------------------------------------------

export const getAyurvedaItemById = async (id) => {
  const item = await Ayurveda.findOne({
    _id: id,
    isActive: true,
  }).lean();

  if (!item) {
    const error = new Error("Ayurveda item not found");
    error.statusCode = 404;
    throw error;
  }

  return item;
};

// ------------------------------------------------------------
// Increment view count
// ------------------------------------------------------------

export const incrementAyurvedaViewCount = async (id) => {
  const item = await Ayurveda.findOneAndUpdate(
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
      returnDocument: "after",
    },
  )
    .select("viewCount")
    .lean();

  if (!item) {
    const error = new Error("Ayurveda item not found");
    error.statusCode = 404;
    throw error;
  }

  return item;
};

// ------------------------------------------------------------
// Get categories
// ------------------------------------------------------------

export const getAyurvedaCategories = async () => {
  const categories = await Ayurveda.aggregate([
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

// ------------------------------------------------------------
// Get featured Ayurveda
// ------------------------------------------------------------

export const getFeaturedAyurveda = async (limit = 10) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 20);

  return Ayurveda.find({
    isActive: true,
    isFeatured: true,
  })
    .sort({
      createdAt: -1,
    })
    .limit(safeLimit)
    .lean();
};

// ------------------------------------------------------------
// Personalized Ayurveda recommendations
// ------------------------------------------------------------

export const getPersonalizedAyurvedaRecommendations = async (userId) => {
  const [healthProfile, goals] = await Promise.all([
    HealthProfile.findOne({
      user: userId,
    }).lean(),

    Goal.find({
      user: userId,
      status: "active",
    }).lean(),
  ]);

  if (!healthProfile) {
    return {
      profileAvailable: false,
      message:
        "Complete your health profile to receive personalized Ayurveda recommendations.",
      recommendations: [],
    };
  }

  const scores = new Map();

  const energyLevel = healthProfile.physicalHealth?.energyLevel;

  const digestion = healthProfile.physicalHealth?.digestion;

  const stressLevel = healthProfile.wellbeing?.stressLevel;

  const sleepQuality = healthProfile.sleep?.sleepQuality;

  const activityLevel = healthProfile.lifestyle?.activityLevel;

  const concerns = [
    ...(healthProfile.physicalHealth?.skinConcerns || []),
    ...(healthProfile.physicalHealth?.hairConcerns || []),
    ...(healthProfile.physicalHealth?.bodyPainAreas || []),
    ...(healthProfile.physicalHealth?.otherConcerns
      ? [healthProfile.physicalHealth.otherConcerns]
      : []),
  ]
    .filter(Boolean)
    .map((item) => String(item).toLowerCase().trim());

  const goalCategories = goals
    .map((goal) => goal.category)
    .filter(Boolean)
    .map((category) => String(category).toLowerCase().trim());

  const items = await Ayurveda.find({
    isActive: true,
  }).lean();

  for (const item of items) {
    let score = 0;

    const recommendation = item.recommendedFor || {};

    // ----------------------------------------------------------
    // Health profile matching
    // ----------------------------------------------------------

    if (energyLevel && recommendation.energyLevels?.includes(energyLevel)) {
      score += 3;
    }

    if (digestion && recommendation.digestion?.includes(digestion)) {
      score += 4;
    }

    if (stressLevel && recommendation.stressLevels?.includes(stressLevel)) {
      score += 4;
    }

    if (sleepQuality && recommendation.sleepQualities?.includes(sleepQuality)) {
      score += 4;
    }

    if (
      activityLevel &&
      recommendation.activityLevels?.includes(activityLevel)
    ) {
      score += 2;
    }

    // ----------------------------------------------------------
    // User concerns
    // ----------------------------------------------------------

    for (const concern of concerns) {
      if (recommendation.concerns?.includes(concern)) {
        score += 4;
      }

      if (item.tags?.includes(concern)) {
        score += 2;
      }

      if (item.bodySystems?.includes(concern)) {
        score += 2;
      }

      if (item.wellnessGoals?.includes(concern)) {
        score += 2;
      }
    }

    // ----------------------------------------------------------
    // User goals
    // ----------------------------------------------------------

    for (const goalCategory of goalCategories) {
      if (recommendation.goalCategories?.includes(goalCategory)) {
        score += 5;
      }

      if (item.wellnessGoals?.includes(goalCategory)) {
        score += 3;
      }

      if (item.category === goalCategory) {
        score += 3;
      }
    }

    // ----------------------------------------------------------
    // Content quality / discovery boost
    // ----------------------------------------------------------

    if (item.isFeatured) {
      score += 1;
    }

    if (score > 0) {
      scores.set(String(item._id), score);
    }
  }

  const recommendations = items
    .filter((item) => scores.has(String(item._id)))
    .sort((a, b) => {
      const scoreDifference =
        scores.get(String(b._id)) - scores.get(String(a._id));

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      if (Boolean(b.isFeatured) !== Boolean(a.isFeatured)) {
        return b.isFeatured ? 1 : -1;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 10)
    .map((item) => ({
      ...item,
      recommendationScore: scores.get(String(item._id)),
    }));

  return {
    profileAvailable: true,
    recommendations,
  };
};
