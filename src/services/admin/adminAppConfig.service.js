import AppConfig from "../../models/appConfig.model.js";

import {
  compareAppVersions,
  isValidAppVersion,
} from "../../utils/appVersion.util.js";

const ALLOWED_PLATFORMS = ["android", "ios"];

const ALLOWED_FIELDS = [
  "latestVersion",
  "minSupportedVersion",
  "forceUpdate",
  "storeUrl",
  "updateMessage",
];

const createError = (message, statusCode, code) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

const validatePlatform = (platform) => {
  if (
    typeof platform !== "string" ||
    !ALLOWED_PLATFORMS.includes(platform.trim().toLowerCase())
  ) {
    throw createError(
      "Platform must be android or ios.",
      400,
      "INVALID_PLATFORM",
    );
  }

  return platform.trim().toLowerCase();
};

const validatePayload = (payload, existingConfig = null) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw createError(
      "A valid configuration object is required.",
      400,
      "INVALID_APP_CONFIG",
    );
  }

  const unknownFields = Object.keys(payload).filter(
    (field) => !ALLOWED_FIELDS.includes(field),
  );

  if (unknownFields.length) {
    throw createError(
      `Unsupported configuration fields: ${unknownFields.join(", ")}.`,
      400,
      "INVALID_APP_CONFIG_FIELDS",
    );
  }

  const data = {};

  for (const field of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      data[field] = payload[field];
    }
  }

  const latestVersion = data.latestVersion ?? existingConfig?.latestVersion;

  const minSupportedVersion =
    data.minSupportedVersion ?? existingConfig?.minSupportedVersion;

  if (
    !isValidAppVersion(latestVersion) ||
    !isValidAppVersion(minSupportedVersion)
  ) {
    throw createError(
      "latestVersion and minSupportedVersion must use the format major.minor.patch.",
      400,
      "INVALID_APP_VERSION",
    );
  }

  if (compareAppVersions(minSupportedVersion, latestVersion) > 0) {
    throw createError(
      "Minimum supported version cannot be newer than the latest version.",
      400,
      "INVALID_VERSION_RANGE",
    );
  }

  if (data.forceUpdate !== undefined && typeof data.forceUpdate !== "boolean") {
    throw createError(
      "forceUpdate must be a boolean.",
      400,
      "INVALID_FORCE_UPDATE",
    );
  }

  const storeUrl = data.storeUrl ?? existingConfig?.storeUrl;

  if (typeof storeUrl !== "string" || !storeUrl.trim()) {
    throw createError(
      "A valid store URL is required.",
      400,
      "STORE_URL_REQUIRED",
    );
  }

  try {
    const parsedUrl = new URL(storeUrl);

    if (!["https:", "http:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    throw createError(
      "storeUrl must be a valid HTTP or HTTPS URL.",
      400,
      "INVALID_STORE_URL",
    );
  }

  if (
    data.updateMessage !== undefined &&
    (typeof data.updateMessage !== "string" ||
      !data.updateMessage.trim() ||
      data.updateMessage.trim().length > 1000)
  ) {
    throw createError(
      "updateMessage must contain between 1 and 1000 characters.",
      400,
      "INVALID_UPDATE_MESSAGE",
    );
  }

  for (const field of [
    "latestVersion",
    "minSupportedVersion",
    "storeUrl",
    "updateMessage",
  ]) {
    if (typeof data[field] === "string") {
      data[field] = data[field].trim();
    }
  }

  return data;
};

export const listAppConfigs = async () => {
  return AppConfig.find().sort({ platform: 1 }).lean();
};

export const getAppConfigByPlatform = async (platform) => {
  const normalizedPlatform = validatePlatform(platform);

  const config = await AppConfig.findOne({
    platform: normalizedPlatform,
  }).lean();

  if (!config) {
    throw createError(
      "App configuration not found.",
      404,
      "APP_CONFIG_NOT_FOUND",
    );
  }

  return config;
};

export const createAppConfig = async (payload) => {
  const platform = validatePlatform(payload?.platform);

  const { platform: ignoredPlatform, ...configPayload } = payload;

  const data = validatePayload(configPayload);

  const existingConfig = await AppConfig.findOne({
    platform,
  });

  if (existingConfig) {
    throw createError(
      `Configuration for ${platform} already exists.`,
      409,
      "APP_CONFIG_ALREADY_EXISTS",
    );
  }

  const config = await AppConfig.create({
    platform,
    ...data,
  });

  return config.toObject();
};

export const updateAppConfig = async (platform, payload) => {
  const normalizedPlatform = validatePlatform(platform);

  const config = await AppConfig.findOne({
    platform: normalizedPlatform,
  });

  if (!config) {
    throw createError(
      "App configuration not found.",
      404,
      "APP_CONFIG_NOT_FOUND",
    );
  }

  const data = validatePayload(payload, config);

  Object.assign(config, data);

  await config.save();

  return config.toObject();
};

export const getMobileAppConfig = async (platform, currentVersion) => {
  const normalizedPlatform = validatePlatform(platform);

  if (!isValidAppVersion(currentVersion)) {
    throw createError(
      "A valid current app version is required.",
      400,
      "INVALID_APP_VERSION",
    );
  }

  const config = await AppConfig.findOne({
    platform: normalizedPlatform,
  }).lean();

  if (!config) {
    throw createError(
      "App configuration not found for this platform.",
      404,
      "APP_CONFIG_NOT_FOUND",
    );
  }

  const normalizedVersion = currentVersion.trim();

  /*
   * Current < Latest
   */
  const updateAvailable =
    compareAppVersions(normalizedVersion, config.latestVersion) < 0;

  /*
   * Current < Minimum supported
   */
  const belowMinimum =
    compareAppVersions(normalizedVersion, config.minSupportedVersion) < 0;

  /*
   * Mandatory update rules:
   *
   * 1. The installed version is below minimum
   *    → ALWAYS mandatory.
   *
   * 2. Admin enabled Force Update and a newer
   *    version exists
   *    → mandatory.
   *
   * Therefore:
   *
   * belowMinimum || (forceUpdate && updateAvailable)
   */
  const forceUpdate =
    belowMinimum || (Boolean(config.forceUpdate) && updateAvailable);

  return {
    platform: config.platform,

    currentVersion: normalizedVersion,

    latestVersion: config.latestVersion,

    minSupportedVersion: config.minSupportedVersion,

    updateAvailable,

    belowMinimum,

    forceUpdate,

    storeUrl: config.storeUrl,

    updateMessage: config.updateMessage,
  };
};
