import HealthProfile from "../models/healthProfile.model.js";
import Goal from "../models/goal.model.js";
import Ayurveda from "../models/ayurveda.model.js";
import Yoga from "../models/yoga.model.js";

const normalize = (value) => {
  if (!value) {
    return "";
  }

  return String(value).trim().toLowerCase();
};

const normalizeArray = (values = []) => {
  return values.filter(Boolean).map((value) => normalize(value));
};

const getUserContext = async (userId) => {
  const [healthProfile, goals] = await Promise.all([
    HealthProfile.findOne({
      user: userId,
    }).lean(),

    Goal.find({
      user: userId,
      status: "active",
    }).lean(),
  ]);

  return {
    healthProfile,
    goals,
  };
};

const buildUserSignals = (healthProfile, goals) => {
  if (!healthProfile) {
    return {
      energyLevel: "",
      digestion: "",
      stressLevel: "",
      sleepQuality: "",
      activityLevel: "",
      yogaExperience: "",
      concerns: [],
      goalCategories: [],
    };
  }

  const physicalHealth = healthProfile.physicalHealth || {};
  const wellbeing = healthProfile.wellbeing || {};
  const lifestyle = healthProfile.lifestyle || {};
  const sleep = healthProfile.sleep || {};
  const fitness = healthProfile.fitness || {};

  const concerns = [
    ...(physicalHealth.skinConcerns || []),
    ...(physicalHealth.hairConcerns || []),
    ...(physicalHealth.bodyPainAreas || []),
    ...(physicalHealth.otherConcerns ? [physicalHealth.otherConcerns] : []),
  ];

  return {
    energyLevel: normalize(physicalHealth.energyLevel),

    digestion: normalize(physicalHealth.digestion),

    stressLevel: normalize(wellbeing.stressLevel),

    sleepQuality: normalize(sleep.sleepQuality),

    activityLevel: normalize(lifestyle.activityLevel),

    yogaExperience: normalize(fitness.yogaExperience),

    concerns: normalizeArray(concerns),

    goalCategories: normalizeArray(goals.map((goal) => goal.category)),
  };
};

const calculateAyurvedaScore = (item, signals) => {
  let score = 0;
  const reasons = [];

  const recommendedFor = item.recommendedFor || {};

  if (
    signals.energyLevel &&
    normalizeArray(recommendedFor.energyLevels).includes(signals.energyLevel)
  ) {
    score += 3;
    reasons.push("Matches your energy level");
  }

  if (
    signals.digestion &&
    normalizeArray(recommendedFor.digestion).includes(signals.digestion)
  ) {
    score += 4;
    reasons.push("Matches your digestion profile");
  }

  if (
    signals.stressLevel &&
    normalizeArray(recommendedFor.stressLevels).includes(signals.stressLevel)
  ) {
    score += 4;
    reasons.push("Matches your stress level");
  }

  if (
    signals.sleepQuality &&
    normalizeArray(recommendedFor.sleepQualities).includes(signals.sleepQuality)
  ) {
    score += 4;
    reasons.push("Matches your sleep profile");
  }

  if (
    signals.activityLevel &&
    normalizeArray(recommendedFor.activityLevels).includes(
      signals.activityLevel,
    )
  ) {
    score += 2;
    reasons.push("Matches your activity level");
  }

  for (const concern of signals.concerns) {
    if (normalizeArray(recommendedFor.concerns).includes(concern)) {
      score += 4;
      reasons.push(`Related to your ${concern} concern`);
    }

    if (normalizeArray(item.tags).includes(concern)) {
      score += 2;
    }
  }

  for (const goalCategory of signals.goalCategories) {
    if (normalizeArray(recommendedFor.goalCategories).includes(goalCategory)) {
      score += 5;
      reasons.push(
        `Aligned with your ${goalCategory.replaceAll("_", " ")} goal`,
      );
    }
  }

  if (item.isFeatured) {
    score += 1;
  }

  return {
    score,
    reasons: [...new Set(reasons)],
  };
};

const calculateYogaScore = (item, signals) => {
  let score = 0;
  const reasons = [];

  const recommendedFor = item.recommendedFor || {};

  if (
    signals.energyLevel &&
    normalizeArray(recommendedFor.energyLevels).includes(signals.energyLevel)
  ) {
    score += 3;
    reasons.push("Matches your energy level");
  }

  if (
    signals.stressLevel &&
    normalizeArray(recommendedFor.stressLevels).includes(signals.stressLevel)
  ) {
    score += 4;
    reasons.push("Matches your stress level");
  }

  if (
    signals.sleepQuality &&
    normalizeArray(recommendedFor.sleepQualities).includes(signals.sleepQuality)
  ) {
    score += 4;
    reasons.push("Matches your sleep profile");
  }

  if (
    signals.activityLevel &&
    normalizeArray(recommendedFor.activityLevels).includes(
      signals.activityLevel,
    )
  ) {
    score += 2;
    reasons.push("Matches your activity level");
  }

  if (
    signals.yogaExperience &&
    normalizeArray(recommendedFor.yogaExperience).includes(
      signals.yogaExperience,
    )
  ) {
    score += 3;
    reasons.push("Matches your Yoga experience");
  }

  for (const concern of signals.concerns) {
    if (normalizeArray(recommendedFor.concerns).includes(concern)) {
      score += 4;
      reasons.push(`Related to your ${concern} concern`);
    }

    if (normalizeArray(item.tags).includes(concern)) {
      score += 2;
    }
  }

  for (const goalCategory of signals.goalCategories) {
    if (normalizeArray(recommendedFor.goalCategories).includes(goalCategory)) {
      score += 5;
      reasons.push(
        `Aligned with your ${goalCategory.replaceAll("_", " ")} goal`,
      );
    }
  }

  if (item.isFeatured) {
    score += 1;
  }

  return {
    score,
    reasons: [...new Set(reasons)],
  };
};

const formatRecommendation = (item, type, scoreData) => {
  return {
    id: item._id,
    type,
    title: item.title,
    slug: item.slug,
    description: item.description,
    category: item.category,
    score: scoreData.score,
    reasons: scoreData.reasons,
    isFeatured: item.isFeatured,
  };
};

export const getRecommendations = async ({
  userId,
  type = "all",
  limit = 10,
}) => {
  const { healthProfile, goals } = await getUserContext(userId);

  if (!healthProfile) {
    return {
      profileAvailable: false,
      message:
        "Complete your health profile to receive personalized recommendations.",
      recommendations: [],
      summary: {
        total: 0,
        ayurveda: 0,
        yoga: 0,
      },
    };
  }

  const signals = buildUserSignals(healthProfile, goals);

  const recommendations = [];

  if (type === "all" || type === "ayurveda") {
    const ayurvedaItems = await Ayurveda.find({
      isActive: true,
    }).lean();

    for (const item of ayurvedaItems) {
      const scoreData = calculateAyurvedaScore(item, signals);

      if (scoreData.score > 0) {
        recommendations.push(formatRecommendation(item, "ayurveda", scoreData));
      }
    }
  }

  if (type === "all" || type === "yoga") {
    const yogaItems = await Yoga.find({
      isActive: true,
    }).lean();

    for (const item of yogaItems) {
      const scoreData = calculateYogaScore(item, signals);

      if (scoreData.score > 0) {
        recommendations.push(formatRecommendation(item, "yoga", scoreData));
      }
    }
  }

  recommendations.sort((a, b) => {
    return b.score - a.score;
  });

  const limitedRecommendations = recommendations.slice(0, limit);

  return {
    profileAvailable: true,

    summary: {
      total: limitedRecommendations.length,

      ayurveda: limitedRecommendations.filter(
        (item) => item.type === "ayurveda",
      ).length,

      yoga: limitedRecommendations.filter((item) => item.type === "yoga")
        .length,
    },

    recommendations: limitedRecommendations,
  };
};
