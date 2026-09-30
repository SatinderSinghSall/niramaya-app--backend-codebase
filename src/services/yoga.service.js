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
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Yoga.find(filter)
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Yoga.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
};

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

export const getFeaturedYoga = async (limit = 10) => {
  return Yoga.find({
    isActive: true,
    isFeatured: true,
  })
    .sort({
      createdAt: -1,
    })
    .limit(limit)
    .lean();
};

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

  if (!healthProfile) {
    return {
      profileAvailable: false,
      message:
        "Complete your health profile to receive personalized Yoga recommendations.",
      recommendations: [],
    };
  }

  const scores = new Map();

  const energyLevel = healthProfile.physicalHealth?.energyLevel;

  const stressLevel = healthProfile.wellbeing?.stressLevel;

  const sleepQuality = healthProfile.sleep?.sleepQuality;

  const activityLevel = healthProfile.lifestyle?.activityLevel;

  const yogaExperience = healthProfile.fitness?.yogaExperience;

  const concerns = [
    ...(healthProfile.physicalHealth?.skinConcerns || []),
    ...(healthProfile.physicalHealth?.hairConcerns || []),
    ...(healthProfile.physicalHealth?.bodyPainAreas || []),
    ...(healthProfile.physicalHealth?.otherConcerns
      ? [healthProfile.physicalHealth.otherConcerns]
      : []),
  ]
    .filter(Boolean)
    .map((item) => item.toLowerCase());

  const goalCategories = goals
    .map((goal) => goal.category)
    .filter(Boolean)
    .map((category) => category.toLowerCase());

  const items = await Yoga.find({
    isActive: true,
  }).lean();

  for (const item of items) {
    let score = 0;

    const recommendation = item.recommendedFor || {};

    if (energyLevel && recommendation.energyLevels?.includes(energyLevel)) {
      score += 3;
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

    if (
      yogaExperience &&
      recommendation.yogaExperience?.includes(yogaExperience)
    ) {
      score += 3;
    }

    for (const concern of concerns) {
      if (recommendation.concerns?.includes(concern)) {
        score += 4;
      }

      if (item.tags?.includes(concern)) {
        score += 2;
      }
    }

    for (const goalCategory of goalCategories) {
      if (recommendation.goalCategories?.includes(goalCategory)) {
        score += 5;
      }
    }

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
      return scores.get(String(b._id)) - scores.get(String(a._id));
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
