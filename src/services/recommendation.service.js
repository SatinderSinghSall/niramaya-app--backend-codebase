import HealthProfile from "../models/healthProfile.model.js";
import Goal from "../models/goal.model.js";
import Ayurveda from "../models/ayurveda.model.js";
import Yoga from "../models/yoga.model.js";

// ─────────────────────────
// NORMALIZATION HELPERS
// ─────────────────────────

const normalize = (value) => {
  if (!value) {
    return "";
  }

  return String(value).trim().toLowerCase();
};

const normalizeArray = (values = []) => {
  return values.filter(Boolean).map((value) => normalize(value));
};

// ─────────────────────────
// GET USER CONTEXT
// ─────────────────────────

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

// ─────────────────────────
// BUILD USER SIGNALS
// ─────────────────────────

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

// ─────────────────────────
// AYURVEDA SCORE
// ─────────────────────────
const calculateAyurvedaScore = (item, signals) => {
  let score = 0;
  const reasons = [];

  const recommendedFor = item.recommendedFor || {};

  // ─────────────────────────
  // ENERGY
  // ─────────────────────────

  if (
    signals.energyLevel &&
    normalizeArray(recommendedFor.energyLevels).includes(signals.energyLevel)
  ) {
    score += 3;
    reasons.push("Matches your energy level");
  }

  // ─────────────────────────
  // DIGESTION
  // ─────────────────────────

  if (
    signals.digestion &&
    normalizeArray(recommendedFor.digestion).includes(signals.digestion)
  ) {
    score += 4;
    reasons.push("Matches your digestion profile");
  }

  // ─────────────────────────
  // STRESS
  // ─────────────────────────

  if (
    signals.stressLevel &&
    normalizeArray(recommendedFor.stressLevels).includes(signals.stressLevel)
  ) {
    score += 4;
    reasons.push("Matches your stress level");
  }

  // ─────────────────────────
  // SLEEP
  // ─────────────────────────

  if (
    signals.sleepQuality &&
    normalizeArray(recommendedFor.sleepQualities).includes(signals.sleepQuality)
  ) {
    score += 4;
    reasons.push("Matches your sleep profile");
  }

  // ─────────────────────────
  // ACTIVITY
  // ─────────────────────────

  if (
    signals.activityLevel &&
    normalizeArray(recommendedFor.activityLevels).includes(
      signals.activityLevel,
    )
  ) {
    score += 2;
    reasons.push("Matches your activity level");
  }

  // ─────────────────────────
  // USER CONCERNS
  // ─────────────────────────

  for (const concern of signals.concerns) {
    const recommendedConcerns = normalizeArray(recommendedFor.concerns);

    const tags = normalizeArray(item.tags);
    const wellnessGoals = normalizeArray(item.wellnessGoals);
    const bodySystems = normalizeArray(item.bodySystems);
    const benefits = normalizeArray(item.benefits);

    if (recommendedConcerns.includes(concern)) {
      score += 4;
      reasons.push(`Related to your ${concern} concern`);
    }

    if (tags.includes(concern)) {
      score += 2;
    }

    if (wellnessGoals.includes(concern)) {
      score += 3;
      reasons.push(`Supports your ${concern} wellness need`);
    }

    if (bodySystems.includes(concern)) {
      score += 3;
      reasons.push(`Relevant to your ${concern} concern`);
    }

    if (benefits.some((benefit) => benefit.includes(concern))) {
      score += 2;
    }
  }

  // ─────────────────────────
  // USER GOALS
  // ─────────────────────────

  for (const goalCategory of signals.goalCategories) {
    const normalizedGoal = normalize(goalCategory);

    if (
      normalizeArray(recommendedFor.goalCategories).includes(normalizedGoal)
    ) {
      score += 5;

      reasons.push(
        `Aligned with your ${normalizedGoal.replaceAll("_", " ")} goal`,
      );
    }

    if (normalizeArray(item.wellnessGoals).includes(normalizedGoal)) {
      score += 3;

      reasons.push(`Supports your ${normalizedGoal.replaceAll("_", " ")} goal`);
    }

    if (normalize(item.category) === normalizedGoal) {
      score += 3;
    }
  }

  // ─────────────────────────
  // CATEGORY MATCH
  // ─────────────────────────

  const concernCategories = {
    digestion: ["digestion"],
    stress: ["stress", "relaxation"],
    sleep: ["sleep", "relaxation"],
    energy: ["energy", "fitness"],
    skin: ["skin"],
    hair: ["hair"],
    immunity: ["immunity"],
    fitness: ["fitness"],
    relaxation: ["relaxation"],
    nutrition: ["nutrition"],
  };

  for (const concern of signals.concerns) {
    const categories = concernCategories[concern] || [];

    if (categories.includes(normalize(item.category))) {
      score += 4;
      reasons.push(`Matches your ${concern} wellness need`);
    }
  }

  // ─────────────────────────
  // DOSHA / PRAKRITI
  // ─────────────────────────

  // Only applies if you later add dosha to the user's
  // health profile/signals.
  if (signals.dosha) {
    const dosha = normalize(signals.dosha);

    if (normalizeArray(item.doshas).includes(dosha)) {
      score += 5;
      reasons.push(`Suitable for ${dosha} dosha`);
    }

    if (normalizeArray(item.prakriti).includes(dosha)) {
      score += 4;
      reasons.push(`Suitable for ${dosha} prakriti`);
    }
  }

  // ─────────────────────────
  // FEATURED
  // ─────────────────────────

  if (item.isFeatured) {
    score += 1;
  }

  return {
    score,
    reasons: [...new Set(reasons)],
  };
};

// ─────────────────────────
// YOGA SCORE
// ─────────────────────────

const calculateYogaScore = (item, signals) => {
  let score = 0;
  const reasons = [];

  const recommendedFor = item.recommendedFor || {};

  // Energy
  if (
    signals.energyLevel &&
    normalizeArray(recommendedFor.energyLevels).includes(signals.energyLevel)
  ) {
    score += 3;

    reasons.push("Matches your energy level");
  }

  // Stress
  if (
    signals.stressLevel &&
    normalizeArray(recommendedFor.stressLevels).includes(signals.stressLevel)
  ) {
    score += 4;

    reasons.push("Matches your stress level");
  }

  // Sleep
  if (
    signals.sleepQuality &&
    normalizeArray(recommendedFor.sleepQualities).includes(signals.sleepQuality)
  ) {
    score += 4;

    reasons.push("Matches your sleep profile");
  }

  // Activity
  if (
    signals.activityLevel &&
    normalizeArray(recommendedFor.activityLevels).includes(
      signals.activityLevel,
    )
  ) {
    score += 2;

    reasons.push("Matches your activity level");
  }

  // Yoga experience
  if (
    signals.yogaExperience &&
    normalizeArray(recommendedFor.yogaExperience).includes(
      signals.yogaExperience,
    )
  ) {
    score += 3;

    reasons.push("Matches your Yoga experience");
  }

  // ─────────────────────────
  // USER CONCERNS
  // ─────────────────────────

  for (const concern of signals.concerns) {
    // Recommended concern
    if (normalizeArray(recommendedFor.concerns).includes(concern)) {
      score += 4;

      reasons.push(`Related to your ${concern} concern`);
    }

    // Tag match
    if (normalizeArray(item.tags).includes(concern)) {
      score += 2;
    }

    // Body focus match
    if (normalizeArray(item.bodyFocus).includes(concern)) {
      score += 2;

      reasons.push(`Targets your ${concern} area`);
    }
  }

  // ─────────────────────────
  // USER GOALS
  // ─────────────────────────

  for (const goalCategory of signals.goalCategories) {
    if (normalizeArray(recommendedFor.goalCategories).includes(goalCategory)) {
      score += 5;

      reasons.push(
        `Aligned with your ${goalCategory.replaceAll("_", " ")} goal`,
      );
    }
  }

  // Featured
  if (item.isFeatured) {
    score += 1;
  }

  return {
    score,
    reasons: [...new Set(reasons)],
  };
};

// ─────────────────────────
// FORMAT RECOMMENDATION
// ─────────────────────────

const formatRecommendation = (item, type, scoreData) => {
  const recommendation = {
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

  // ─────────────────────────
  // YOGA-SPECIFIC DATA
  // ─────────────────────────

  if (type === "yoga") {
    recommendation.imageUrl = item.imageUrl;

    recommendation.videoUrl = item.videoUrl;

    recommendation.difficulty = item.difficulty;

    recommendation.durationMinutes = item.durationMinutes;

    recommendation.equipment = item.equipment || [];

    recommendation.bodyFocus = item.bodyFocus || [];

    recommendation.tags = item.tags || [];

    recommendation.benefits = item.benefits || [];
  }

  // ─────────────────────────
  // AYURVEDA-SPECIFIC DATA
  // ─────────────────────────

  if (type === "ayurveda") {
    recommendation.imageUrl = item.imageUrl;
    recommendation.videoUrl = item.videoUrl;

    recommendation.shortDescription = item.shortDescription;
    recommendation.type = item.type;
    recommendation.durationMinutes = item.durationMinutes;
    recommendation.difficulty = item.difficulty;

    recommendation.bestTime = item.bestTime || [];
    recommendation.frequency = item.frequency;
    recommendation.duration = item.duration;

    recommendation.doshas = item.doshas || [];
    recommendation.prakriti = item.prakriti || [];

    recommendation.bodySystems = item.bodySystems || [];
    recommendation.wellnessGoals = item.wellnessGoals || [];

    recommendation.tags = item.tags || [];
    recommendation.benefits = item.benefits || [];
    recommendation.suitableFor = item.suitableFor || [];

    recommendation.ingredients = item.ingredients || [];

    recommendation.precautions = item.precautions || [];
    recommendation.contraindications = item.contraindications || [];

    recommendation.howToUse = item.howToUse || [];

    recommendation.properties = item.properties || {};

    recommendation.traditionalUseNote = item.traditionalUseNote;

    recommendation.evidenceNote = item.evidenceNote;

    recommendation.sources = item.sources || [];
  }

  return recommendation;
};

// ─────────────────────────
// GET RECOMMENDATIONS
// ─────────────────────────

export const getRecommendations = async ({
  userId,
  type = "all",
  limit = 10,
}) => {
  const { healthProfile, goals } = await getUserContext(userId);

  // ─────────────────────────
  // PROFILE NOT AVAILABLE
  // ─────────────────────────

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

  // ─────────────────────────
  // AYURVEDA
  // ─────────────────────────

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

  // ─────────────────────────
  // YOGA
  // ─────────────────────────

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

  // ─────────────────────────
  // SORT
  // ─────────────────────────

  recommendations.sort((a, b) => b.score - a.score);

  // ─────────────────────────
  // SAFE LIMIT
  // ─────────────────────────

  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const limitedRecommendations = recommendations.slice(0, safeLimit);

  // ─────────────────────────
  // RESPONSE
  // ─────────────────────────

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
