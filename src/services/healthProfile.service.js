import HealthProfile from "../models/healthProfile.model.js";

export const getHealthProfile = async (userId) => {
  return HealthProfile.findOne({ user: userId }).lean();
};

export const createHealthProfile = async (userId, profileData) => {
  const existingProfile = await HealthProfile.findOne({
    user: userId,
  });

  if (existingProfile) {
    const error = new Error("Health profile already exists");

    error.statusCode = 409;

    throw error;
  }

  return HealthProfile.create({
    user: userId,
    ...profileData,

    onboarding: {
      ...(profileData.onboarding || {}),
      completed: true,
      completedAt: new Date(),
      completionPercentage: 100,
    },
  });
};

export const updateHealthProfile = async (userId, profileData) => {
  const profile = await HealthProfile.findOne({
    user: userId,
  });

  if (!profile) {
    const error = new Error("Health profile not found");

    error.statusCode = 404;

    throw error;
  }

  Object.keys(profileData).forEach((section) => {
    if (
      profileData[section] &&
      typeof profileData[section] === "object" &&
      !Array.isArray(profileData[section])
    ) {
      Object.assign(profile[section], profileData[section]);
    } else {
      profile[section] = profileData[section];
    }
  });

  await profile.save();

  return profile;
};

export const deleteHealthProfile = async (userId) => {
  const profile = await HealthProfile.findOneAndDelete({
    user: userId,
  });

  if (!profile) {
    const error = new Error("Health profile not found");

    error.statusCode = 404;

    throw error;
  }

  return profile;
};
