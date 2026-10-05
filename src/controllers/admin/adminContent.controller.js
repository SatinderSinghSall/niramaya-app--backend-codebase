import {
  listContent,
  getContentById,
  getContentCategories,
  getContentStats,
  createContent,
  updateContent,
  setContentStatus,
  setContentFeatured,
  deleteContent,
} from "../../services/admin/adminContent.service.js";

import {
  createAyurvedaSchema,
  updateAyurvedaSchema,
} from "../../utils/ayurveda.validation.js";

import {
  createYogaSchema,
  updateYogaSchema,
} from "../../utils/yoga.validation.js";

const schemas = {
  ayurveda: {
    create: createAyurvedaSchema,
    update: updateAyurvedaSchema,
  },
  yoga: {
    create: createYogaSchema,
    update: updateYogaSchema,
  },
};

const parseBody = (contentType, mode, body) => {
  const result = schemas[contentType][mode].safeParse(body);

  if (!result.success) {
    const error = new Error("Content validation failed");
    error.statusCode = 400;
    error.code = "CONTENT_VALIDATION_ERROR";
    error.details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    throw error;
  }

  return result.data;
};

const handler = (fn) => async (req, res, next) => {
  try {
    const data = await fn(req, res);
    return res.status(data.status || 200).json({
      success: true,
      ...(data.message ? { message: data.message } : {}),
      data: data.data,
    });
  } catch (error) {
    next(error);
  }
};

const list = (contentType) =>
  handler(async (req) => ({
    data: await listContent(contentType, req.query),
  }));

const getOne = (contentType) =>
  handler(async (req) => ({
    data: await getContentById(contentType, req.params.id),
  }));

const categories = (contentType) =>
  handler(async () => ({
    data: await getContentCategories(contentType),
  }));

const stats = (contentType) =>
  handler(async () => ({
    data: await getContentStats(contentType),
  }));

const create = (contentType) =>
  handler(async (req) => ({
    status: 201,
    message: `${contentType === "ayurveda" ? "Ayurveda" : "Yoga"} content created successfully`,
    data: await createContent(
      contentType,
      parseBody(contentType, "create", req.body),
    ),
  }));

const update = (contentType) =>
  handler(async (req) => ({
    message: `${contentType === "ayurveda" ? "Ayurveda" : "Yoga"} content updated successfully`,
    data: await updateContent(
      contentType,
      req.params.id,
      parseBody(contentType, "update", req.body),
    ),
  }));

const status = (contentType) =>
  handler(async (req) => ({
    message: "Content status updated successfully",
    data: await setContentStatus(contentType, req.params.id, req.body.isActive),
  }));

const featured = (contentType) =>
  handler(async (req) => ({
    message: "Featured status updated successfully",
    data: await setContentFeatured(
      contentType,
      req.params.id,
      req.body.isFeatured,
    ),
  }));

const remove = (contentType) =>
  handler(async (req) => ({
    message: "Content deleted successfully",
    data: await deleteContent(contentType, req.params.id),
  }));

export const createAyurvedaController = {
  list: list("ayurveda"),
  getOne: getOne("ayurveda"),
  categories: categories("ayurveda"),
  stats: stats("ayurveda"),
  create: create("ayurveda"),
  update: update("ayurveda"),
  status: status("ayurveda"),
  featured: featured("ayurveda"),
  remove: remove("ayurveda"),
};

export const createYogaController = {
  list: list("yoga"),
  getOne: getOne("yoga"),
  categories: categories("yoga"),
  stats: stats("yoga"),
  create: create("yoga"),
  update: update("yoga"),
  status: status("yoga"),
  featured: featured("yoga"),
  remove: remove("yoga"),
};
