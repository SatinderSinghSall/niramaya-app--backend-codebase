import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Settings from "../models/settings.model.js";

import { sanitizeUser } from "../utils/user.util.js";

export const getProfile = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    const error = new Error("User not found");

    error.statusCode = 404;

    throw error;
  }

  return sanitizeUser(user);
};

export const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");

    error.statusCode = 404;

    throw error;
  }

  if (data.firstName !== undefined) {
    user.firstName = data.firstName;
  }

  if (data.lastName !== undefined) {
    user.lastName = data.lastName;
  }

  if (data.phone !== undefined) {
    user.phone = data.phone || undefined;
  }

  await user.save();

  return sanitizeUser(user.toObject());
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    const error = new Error("User not found");

    error.statusCode = 404;

    throw error;
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatches) {
    const error = new Error("Current password is incorrect");

    error.statusCode = 400;

    throw error;
  }

  if (currentPassword === newPassword) {
    const error = new Error(
      "New password must be different from current password",
    );

    error.statusCode = 400;

    throw error;
  }

  const saltRounds = 12;

  user.password = await bcrypt.hash(newPassword, saltRounds);

  user.refreshTokenHash = undefined;

  await user.save();

  return {
    success: true,
  };
};

export const getSettings = async (userId) => {
  let settings = await Settings.findOne({
    user: userId,
  }).lean();

  if (!settings) {
    settings = await Settings.create({
      user: userId,
    });

    settings = settings.toObject();
  }

  return settings;
};

export const updateSettings = async (userId, data) => {
  const settings = await Settings.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        ...(data.notifications && {
          "notifications.enabled": data.notifications.enabled,

          "notifications.goalReminders": data.notifications.goalReminders,

          "notifications.progressReminders":
            data.notifications.progressReminders,

          "notifications.consultationUpdates":
            data.notifications.consultationUpdates,

          "notifications.wellnessReminders":
            data.notifications.wellnessReminders,
        }),

        ...(data.reminders && {
          "reminders.enabled": data.reminders.enabled,

          "reminders.preferredTime": data.reminders.preferredTime,
        }),

        ...(data.appearance && {
          "appearance.theme": data.appearance.theme,
        }),

        ...(data.privacy && {
          "privacy.analyticsEnabled": data.privacy.analyticsEnabled,
        }),

        ...(data.preferences && {
          "preferences.language": data.preferences.language,

          "preferences.timezone": data.preferences.timezone,
        }),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).lean();

  return settings;
};

export const deleteAccount = async (userId, password) => {
  const user = await User.findById(userId).select(
    "+password +refreshTokenHash",
  );

  if (!user) {
    const error = new Error("User not found");

    error.statusCode = 404;

    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    const error = new Error("Password is incorrect");

    error.statusCode = 400;

    throw error;
  }

  /*
   * Soft delete the account rather than
   * immediately destroying user data.
   *
   * This is safer for the current project
   * and can be changed later if required.
   */
  user.isActive = false;
  user.refreshTokenHash = undefined;

  await user.save();

  await Settings.deleteOne({
    user: userId,
  });

  return {
    success: true,
  };
};
