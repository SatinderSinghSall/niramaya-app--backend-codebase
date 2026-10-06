import mongoose from "mongoose";

import HealthWellnessTip from "../../models/healthWellnessTip.model.js";

const ALLOWED_CATEGORIES = [
  "nutrition",
  "fitness",
  "yoga",
  "ayurveda",
  "mental-wellbeing",
  "sleep",
  "stress-management",
  "lifestyle",
  "preventive-care",
  "personal-care",
  "healthy-habits",
  "general-wellness",
];

const ALLOWED_TYPES = [
  "tip",
  "guide",
  "lesson",
  "routine",
  "exercise",
  "practice",
  "warning",
  "educational",
];

const ALLOWED_DIFFICULTIES = ["beginner", "intermediate", "advanced"];

const ALLOWED_FIELDS = [
  "title",
  "shortDescription",
  "content",
  "highlights",
  "category",
  "type",
  "tags",
  "image",
  "thumbnailUrl",
  "source",
  "references",
  "disclaimer",
  "safetyNote",
  "reviewed",
  "reviewedBy",
  "readTimeMinutes",
  "difficulty",
  "isActive",
  "featured",
  "priority",
  "startDate",
  "endDate",
  "action",
];

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

function pickAllowedFields(data = {}) {
  return Object.fromEntries(
    ALLOWED_FIELDS.filter((field) =>
      Object.prototype.hasOwnProperty.call(data, field),
    ).map((field) => [field, data[field]]),
  );
}

function normalizeString(value, field) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw createServiceError(`${field} must be a string.`);
  }

  return value.trim();
}

function normalizeStringArray(value, field, maxLength) {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw createServiceError(`${field} must be an array.`);
  }

  if (value.length > maxLength) {
    throw createServiceError(
      `${field} cannot contain more than ${maxLength} items.`,
    );
  }

  return value.map((item) => {
    if (typeof item !== "string" || !item.trim()) {
      throw createServiceError(`${field} contains an invalid value.`);
    }

    return item.trim();
  });
}

function normalizeDate(value, field) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw createServiceError(`${field} must be a valid date.`);
  }

  return date;
}

function normalizeBoolean(value, field) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw createServiceError(`${field} must be a boolean.`);
  }

  return value;
}

function normalizeNumber(value, field, min, max) {
  if (value === undefined) {
    return undefined;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < min || number > max) {
    throw createServiceError(
      `${field} must be a number between ${min} and ${max}.`,
    );
  }

  return number;
}

function validateUrl(value, field, required = false) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      throw createServiceError(`${field} is required.`);
    }

    return value;
  }

  if (typeof value !== "string" || !/^https?:\/\/.+/i.test(value.trim())) {
    throw createServiceError(`${field} must be a valid HTTP or HTTPS URL.`);
  }

  return value.trim();
}

function normalizeNestedObject(value, field) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw createServiceError(`${field} must be an object.`);
  }

  return value;
}

function validateReferences(references) {
  if (references === undefined) {
    return undefined;
  }

  if (!Array.isArray(references)) {
    throw createServiceError("References must be an array.");
  }

  if (references.length > 15) {
    throw createServiceError("A maximum of 15 references is allowed.");
  }

  return references.map((reference, index) => {
    if (
      !reference ||
      typeof reference !== "object" ||
      Array.isArray(reference)
    ) {
      throw createServiceError(`Reference ${index + 1} is invalid.`);
    }

    const title =
      typeof reference.title === "string" ? reference.title.trim() : "";

    if (!title) {
      throw createServiceError(`Reference ${index + 1} title is required.`);
    }

    if (title.length > 250) {
      throw createServiceError(
        `Reference ${index + 1} title cannot exceed 250 characters.`,
      );
    }

    const source =
      reference.source === undefined || reference.source === null
        ? undefined
        : String(reference.source).trim();

    if (source && source.length > 200) {
      throw createServiceError(
        `Reference ${index + 1} source cannot exceed 200 characters.`,
      );
    }

    const url = validateUrl(reference.url, `Reference ${index + 1} URL`);

    const publishedDate = normalizeDate(
      reference.publishedDate,
      `Reference ${index + 1} published date`,
    );

    return {
      title,
      ...(source ? { source } : {}),
      ...(url ? { url } : {}),
      ...(publishedDate ? { publishedDate } : {}),
    };
  });
}

function normalizeAction(action) {
  if (action === undefined) {
    return undefined;
  }

  if (action === null) {
    return {
      enabled: false,
    };
  }

  if (typeof action !== "object" || Array.isArray(action)) {
    throw createServiceError("Action must be an object.");
  }

  const enabled =
    action.enabled === undefined
      ? false
      : normalizeBoolean(action.enabled, "action.enabled");

  const label =
    action.label === undefined || action.label === null
      ? ""
      : String(action.label).trim();

  const route =
    action.route === undefined || action.route === null
      ? ""
      : String(action.route).trim();

  if (enabled && !label) {
    throw createServiceError(
      "Action label is required when action is enabled.",
    );
  }

  if (enabled && !route) {
    throw createServiceError(
      "Action route is required when action is enabled.",
    );
  }

  if (label.length > 50) {
    throw createServiceError("Action label cannot exceed 50 characters.");
  }

  if (route.length > 200) {
    throw createServiceError("Action route cannot exceed 200 characters.");
  }

  return {
    enabled,
    ...(label ? { label } : {}),
    ...(route ? { route } : {}),
  };
}

function normalizeImage(image) {
  if (image === undefined) {
    return undefined;
  }

  if (image === null || typeof image !== "object" || Array.isArray(image)) {
    throw createServiceError("Image must be an object.");
  }

  const enabled =
    image.enabled === undefined
      ? false
      : normalizeBoolean(image.enabled, "image.enabled");

  const url =
    image.url === undefined || image.url === null
      ? ""
      : String(image.url).trim();

  const altText =
    image.altText === undefined || image.altText === null
      ? ""
      : String(image.altText).trim();

  const caption =
    image.caption === undefined || image.caption === null
      ? ""
      : String(image.caption).trim();

  const credit =
    image.credit === undefined || image.credit === null
      ? ""
      : String(image.credit).trim();

  if (enabled && !url) {
    throw createServiceError("Image URL is required when image is enabled.");
  }

  if (url) {
    validateUrl(url, "Image URL", true);
  }

  return {
    enabled,
    ...(url ? { url } : {}),
    ...(altText ? { altText } : {}),
    ...(caption ? { caption } : {}),
    ...(credit ? { credit } : {}),
  };
}

function normalizeSource(source) {
  if (source === undefined) {
    return undefined;
  }

  if (source === null) {
    return null;
  }

  const object = normalizeNestedObject(source, "source");

  const name =
    object.name === undefined || object.name === null
      ? ""
      : String(object.name).trim();

  const url = validateUrl(object.url, "Source URL");

  const accessedAt = normalizeDate(object.accessedAt, "Source accessed date");

  return {
    ...(name ? { name } : {}),
    ...(url ? { url } : {}),
    ...(accessedAt ? { accessedAt } : {}),
  };
}

function normalizeReviewer(reviewed, reviewedBy) {
  if (reviewed === false) {
    return {
      reviewed: false,
      reviewedBy: null,
    };
  }

  if (reviewedBy === undefined || reviewedBy === null) {
    if (reviewed) {
      throw createServiceError(
        "Reviewer information is required when content is marked as reviewed.",
      );
    }

    return {
      reviewed,
    };
  }

  const object = normalizeNestedObject(reviewedBy, "reviewedBy");

  const name = typeof object.name === "string" ? object.name.trim() : "";

  const qualification =
    typeof object.qualification === "string" ? object.qualification.trim() : "";

  const reviewedAt = normalizeDate(object.reviewedAt, "reviewedBy.reviewedAt");

  if (reviewed && !name) {
    throw createServiceError(
      "Reviewer name is required when content is marked as reviewed.",
    );
  }

  return {
    reviewed,
    reviewedBy: {
      ...(name ? { name } : {}),
      ...(qualification ? { qualification } : {}),
      ...(reviewedAt ? { reviewedAt } : {}),
    },
  };
}

function normalizePayload(input, { partial = false } = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw createServiceError("Invalid health and wellness tip payload.");
  }

  const data = pickAllowedFields(input);

  const output = {};

  // --------------------------------------------------------------
  // Strings
  // --------------------------------------------------------------

  for (const field of [
    "title",
    "shortDescription",
    "content",
    "disclaimer",
    "safetyNote",
    "thumbnailUrl",
  ]) {
    if (!partial || Object.prototype.hasOwnProperty.call(data, field)) {
      const value = normalizeString(data[field], field);

      if (
        !partial &&
        ["title", "shortDescription", "content"].includes(field) &&
        !value
      ) {
        throw createServiceError(`${field} is required.`);
      }

      if (field === "thumbnailUrl" && value) {
        validateUrl(value, "Thumbnail URL", true);
      }

      output[field] = value;
    }
  }

  // --------------------------------------------------------------
  // Arrays
  // --------------------------------------------------------------

  if (!partial || Object.prototype.hasOwnProperty.call(data, "highlights")) {
    output.highlights = normalizeStringArray(
      data.highlights ?? [],
      "highlights",
      8,
    );
  }

  if (!partial || Object.prototype.hasOwnProperty.call(data, "tags")) {
    output.tags = normalizeStringArray(data.tags ?? [], "tags", 15);
  }

  // --------------------------------------------------------------
  // Category
  // --------------------------------------------------------------

  if (!partial || Object.prototype.hasOwnProperty.call(data, "category")) {
    const category = normalizeString(
      data.category ?? "general-wellness",
      "category",
    );

    if (!ALLOWED_CATEGORIES.includes(category)) {
      throw createServiceError("Invalid health and wellness category.");
    }

    output.category = category;
  }

  // --------------------------------------------------------------
  // Type
  // --------------------------------------------------------------

  if (!partial || Object.prototype.hasOwnProperty.call(data, "type")) {
    const type = normalizeString(data.type ?? "tip", "type");

    if (!ALLOWED_TYPES.includes(type)) {
      throw createServiceError("Invalid health and wellness content type.");
    }

    output.type = type;
  }

  // --------------------------------------------------------------
  // Difficulty
  // --------------------------------------------------------------

  if (!partial || Object.prototype.hasOwnProperty.call(data, "difficulty")) {
    const difficulty = normalizeString(
      data.difficulty ?? "beginner",
      "difficulty",
    );

    if (!ALLOWED_DIFFICULTIES.includes(difficulty)) {
      throw createServiceError("Invalid difficulty level.");
    }

    output.difficulty = difficulty;
  }

  // --------------------------------------------------------------
  // Numbers
  // --------------------------------------------------------------

  if (
    !partial ||
    Object.prototype.hasOwnProperty.call(data, "readTimeMinutes")
  ) {
    output.readTimeMinutes = normalizeNumber(
      data.readTimeMinutes ?? 3,
      "readTimeMinutes",
      1,
      120,
    );
  }

  if (!partial || Object.prototype.hasOwnProperty.call(data, "priority")) {
    output.priority = normalizeNumber(data.priority ?? 0, "priority", 0, 9999);
  }

  // --------------------------------------------------------------
  // Booleans
  // --------------------------------------------------------------

  for (const field of ["isActive", "featured", "reviewed"]) {
    if (!partial || Object.prototype.hasOwnProperty.call(data, field)) {
      output[field] = normalizeBoolean(
        data[field] ??
          (field === "isActive" || field === "reviewed"
            ? field === "isActive"
            : false),
        field,
      );
    }
  }

  // --------------------------------------------------------------
  // Dates
  // --------------------------------------------------------------

  if (!partial || Object.prototype.hasOwnProperty.call(data, "startDate")) {
    output.startDate = normalizeDate(data.startDate ?? new Date(), "startDate");
  }

  if (!partial || Object.prototype.hasOwnProperty.call(data, "endDate")) {
    output.endDate = normalizeDate(data.endDate, "endDate");
  }

  // --------------------------------------------------------------
  // Image
  // --------------------------------------------------------------

  if (Object.prototype.hasOwnProperty.call(data, "image")) {
    output.image = normalizeImage(data.image);
  }

  // --------------------------------------------------------------
  // Source
  // --------------------------------------------------------------

  if (Object.prototype.hasOwnProperty.call(data, "source")) {
    output.source = normalizeSource(data.source);
  }

  // --------------------------------------------------------------
  // References
  // --------------------------------------------------------------

  if (Object.prototype.hasOwnProperty.call(data, "references")) {
    output.references = validateReferences(data.references);
  }

  // --------------------------------------------------------------
  // Reviewer
  // --------------------------------------------------------------

  if (
    Object.prototype.hasOwnProperty.call(data, "reviewed") ||
    Object.prototype.hasOwnProperty.call(data, "reviewedBy")
  ) {
    const reviewer = normalizeReviewer(
      output.reviewed ?? data.reviewed ?? false,
      data.reviewedBy,
    );

    Object.assign(output, reviewer);
  }

  // --------------------------------------------------------------
  // Action
  // --------------------------------------------------------------

  if (Object.prototype.hasOwnProperty.call(data, "action")) {
    output.action = normalizeAction(data.action);
  }

  // --------------------------------------------------------------
  // Date relationship
  // --------------------------------------------------------------

  const startDate = output.startDate;

  const endDate = output.endDate;

  if (startDate && endDate && endDate <= startDate) {
    throw createServiceError("End date must be later than start date.");
  }

  return output;
}

// ================================================================
// GET LIST
// ================================================================

export async function getHealthWellnessTips({
  page = 1,
  limit = 20,
  search = "",
  category = "",
  type = "",
  difficulty = "",
  status = "all",
  featured,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) {
  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const filter = {};

  if (search?.trim()) {
    const searchRegex = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );

    filter.$or = [
      { title: searchRegex },
      {
        shortDescription: searchRegex,
      },
      { content: searchRegex },
      { tags: searchRegex },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (type) {
    filter.type = type;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (status === "active") {
    filter.isActive = true;
  }

  if (status === "inactive") {
    filter.isActive = false;
  }

  if (featured === true) {
    filter.featured = true;
  }

  if (featured === false) {
    filter.featured = false;
  }

  const sortMap = {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    title: "title",
    priority: "priority",
    startDate: "startDate",
  };

  const sortField = sortMap[sortBy] || "createdAt";

  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    HealthWellnessTip.find(filter)
      .sort({
        [sortField]: sortDirection,
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

// ================================================================
// GET ONE
// ================================================================

export async function getHealthWellnessTipById(id) {
  assertObjectId(id);

  const item = await HealthWellnessTip.findById(id).lean();

  if (!item) {
    throw createServiceError(
      "Health and wellness tip not found.",
      404,
      "HEALTH_WELLNESS_TIP_NOT_FOUND",
    );
  }

  return item;
}

// ================================================================
// CREATE
// ================================================================

export async function createHealthWellnessTip(payload) {
  const data = normalizePayload(payload);

  const item = await HealthWellnessTip.create(data);

  return item.toObject();
}

// ================================================================
// UPDATE
// ================================================================

export async function updateHealthWellnessTip(id, payload) {
  assertObjectId(id);

  const existing = await HealthWellnessTip.findById(id);

  if (!existing) {
    throw createServiceError(
      "Health and wellness tip not found.",
      404,
      "HEALTH_WELLNESS_TIP_NOT_FOUND",
    );
  }

  const data = normalizePayload(payload, {
    partial: true,
  });

  for (const [key, value] of Object.entries(data)) {
    existing[key] = value;
  }

  await existing.validate();
  await existing.save();

  return existing.toObject();
}

// ================================================================
// DELETE
// ================================================================

export async function deleteHealthWellnessTip(id) {
  assertObjectId(id);

  const item = await HealthWellnessTip.findByIdAndDelete(id);

  if (!item) {
    throw createServiceError(
      "Health and wellness tip not found.",
      404,
      "HEALTH_WELLNESS_TIP_NOT_FOUND",
    );
  }

  return item.toObject();
}

// ================================================================
// FEATURED
// ================================================================

export async function getFeaturedHealthWellnessTips({ limit = 5 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);

  const now = new Date();

  return HealthWellnessTip.find({
    isActive: true,
    featured: true,
    startDate: {
      $lte: now,
    },
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  })
    .sort({
      priority: -1,
      startDate: -1,
    })
    .limit(safeLimit)
    .lean();
}
