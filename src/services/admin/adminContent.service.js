import mongoose from "mongoose";

import Ayurveda from "../../models/ayurveda.model.js";
import Yoga from "../../models/yoga.model.js";

const CONFIG = {
  ayurveda: {
    model: Ayurveda,
    label: "Ayurveda",
    searchFields: [
      "title",
      "slug",
      "shortDescription",
      "description",
      "tags",
      "benefits",
      "wellnessGoals",
      "bodySystems",
      "doshas",
      "usage",
      "precautions",
      "contraindications",
      "traditionalUseNote",
      "evidenceNote",
      "ingredients.name",
    ],
  },
  yoga: {
    model: Yoga,
    label: "Yoga",
    searchFields: [
      "title",
      "slug",
      "description",
      "tags",
      "benefits",
      "instructions",
      "precautions",
      "contraindications",
      "bodyFocus",
      "equipment",
    ],
  },
};

const BAD_WRITE_KEYS = new Set(["_id", "id", "__v", "createdAt", "updatedAt"]);
const SORT_FIELDS = new Set([
  "_id",
  "title",
  "slug",
  "type",
  "category",
  "difficulty",
  "durationMinutes",
  "isActive",
  "isFeatured",
  "viewCount",
  "createdAt",
  "updatedAt",
]);

const fail = (message, statusCode = 400, code = "ADMIN_CONTENT_ERROR") => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  throw error;
};

const getConfig = (contentType) => {
  const config = CONFIG[contentType];
  if (!config) fail("Unsupported content type", 400, "INVALID_CONTENT_TYPE");
  return config;
};

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseBoolean = (value, name) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  fail(`${name} must be true or false`);
};

const assertId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    fail("Invalid content ID", 400, "INVALID_CONTENT_ID");
  }
};

const allowedSchemaKeys = (Model) => {
  const keys = new Set();
  for (const path of Object.keys(Model.schema.paths)) {
    if (
      path === "_id" ||
      path === "__v" ||
      path === "createdAt" ||
      path === "updatedAt"
    )
      continue;
    const top = path.split(".")[0];
    keys.add(top);
  }
  return keys;
};

const cleanWritePayload = (Model, body = {}) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    fail("Request body must be a JSON object");
  }

  const allowed = allowedSchemaKeys(Model);
  const unknown = Object.keys(body).filter(
    (key) => BAD_WRITE_KEYS.has(key) || !allowed.has(key),
  );

  if (unknown.length) {
    fail(`Unsupported content fields: ${unknown.join(", ")}`);
  }

  return Object.fromEntries(
    Object.entries(body).filter(([key]) => !BAD_WRITE_KEYS.has(key)),
  );
};

const normalizeValidationError = (error) => {
  if (error?.name === "ValidationError") {
    const details = Object.values(error.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    error.statusCode = 400;
    error.details = details;
  }

  if (error?.code === 11000) {
    error.statusCode = 409;
    error.code = "DUPLICATE_CONTENT";
    error.message = "A content item with the same unique field already exists.";
  }

  return error;
};

export const listContent = async (contentType, query = {}) => {
  const { model: Model } = getConfig(contentType);

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 50);
  const filter = {};

  if (query.search?.trim()) {
    const regex = new RegExp(escapeRegex(query.search.trim()), "i");
    filter.$or = getConfig(contentType).searchFields.map((field) => ({
      [field]: regex,
    }));
  }

  if (query.category) filter.category = query.category;
  if (query.type) filter.type = query.type;
  if (query.difficulty) filter.difficulty = query.difficulty;

  const isActive = parseBoolean(query.isActive, "isActive");
  const isFeatured = parseBoolean(query.isFeatured, "isFeatured");
  if (isActive !== undefined) filter.isActive = isActive;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured;

  const sortBy = SORT_FIELDS.has(query.sortBy) ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Model.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    filters: {
      search: query.search || "",
      category: query.category || null,
      type: query.type || null,
      difficulty: query.difficulty || null,
      isActive: isActive ?? null,
      isFeatured: isFeatured ?? null,
      sortBy,
      sortOrder: sortOrder === 1 ? "asc" : "desc",
    },
  };
};

export const getContentById = async (contentType, id) => {
  assertId(id);
  const { model: Model, label } = getConfig(contentType);
  const item = await Model.findById(id).lean();
  if (!item) fail(`${label} content not found`, 404, "CONTENT_NOT_FOUND");
  return item;
};

export const getContentCategories = async (contentType) => {
  const { model: Model } = getConfig(contentType);

  const rows = await Model.aggregate([
    {
      $match: { isActive: true, category: { $exists: true, $nin: [null, ""] } },
    },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return rows.map((row) => ({
    category: row._id,
    count: row.count,
  }));
};

export const getContentStats = async (contentType) => {
  const { model: Model, label } = getConfig(contentType);
  const [total, active, featured] = await Promise.all([
    Model.countDocuments({}),
    Model.countDocuments({ isActive: true }),
    Model.countDocuments({ isFeatured: true }),
  ]);

  return {
    contentType,
    label,
    total,
    active,
    inactive: total - active,
    featured,
    notFeatured: total - featured,
  };
};

export const createContent = async (contentType, body) => {
  const { model: Model, label } = getConfig(contentType);
  const payload = cleanWritePayload(Model, body);

  if (
    Object.prototype.hasOwnProperty.call(Model.schema.paths, "isActive") &&
    payload.isActive === undefined
  ) {
    payload.isActive = false;
  }

  try {
    const item = await Model.create(payload);
    return item.toObject();
  } catch (error) {
    throw normalizeValidationError(error);
  }
};

export const updateContent = async (contentType, id, body) => {
  assertId(id);
  const { model: Model, label } = getConfig(contentType);
  const payload = cleanWritePayload(Model, body);

  if (!Object.keys(payload).length) {
    fail("At least one editable field is required");
  }

  const item = await Model.findById(id);
  if (!item) fail(`${label} content not found`, 404, "CONTENT_NOT_FOUND");

  Object.assign(item, payload);

  try {
    await item.save();
    return item.toObject();
  } catch (error) {
    throw normalizeValidationError(error);
  }
};

export const setContentStatus = async (contentType, id, isActive) => {
  assertId(id);
  const { model: Model, label } = getConfig(contentType);
  const parsed = parseBoolean(isActive, "isActive");

  if (parsed === undefined) fail("isActive is required");

  const item = await Model.findByIdAndUpdate(
    id,
    { $set: { isActive: parsed } },
    { new: true, runValidators: true },
  ).lean();

  if (!item) fail(`${label} content not found`, 404, "CONTENT_NOT_FOUND");
  return item;
};

export const setContentFeatured = async (contentType, id, isFeatured) => {
  assertId(id);
  const { model: Model, label } = getConfig(contentType);
  const parsed = parseBoolean(isFeatured, "isFeatured");

  if (parsed === undefined) fail("isFeatured is required");

  const item = await Model.findByIdAndUpdate(
    id,
    { $set: { isFeatured: parsed } },
    { new: true, runValidators: true },
  ).lean();

  if (!item) fail(`${label} content not found`, 404, "CONTENT_NOT_FOUND");
  return item;
};

export const deleteContent = async (contentType, id) => {
  assertId(id);
  const { model: Model, label } = getConfig(contentType);
  const item = await Model.findByIdAndDelete(id).lean();

  if (!item) fail(`${label} content not found`, 404, "CONTENT_NOT_FOUND");

  return {
    id: item._id,
    message: `${label} content deleted successfully`,
  };
};
