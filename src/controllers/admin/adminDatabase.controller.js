import {
  createDocument,
  deleteDocument,
  getCollectionDocuments,
  getCollectionOverview,
  getCollectionSchema,
  getDocument,
  listCollections,
  updateDocument,
} from "../../services/admin/adminDatabase.service.js";

export const getCollections = async (req, res, next) => {
  try {
    const collections = await listCollections();

    res.status(200).json({
      success: true,
      data: { collections },
    });
  } catch (error) {
    next(error);
  }
};

export const getCollection = async (req, res, next) => {
  try {
    const result = await getCollectionOverview(req.params.name);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const result = await getCollectionDocuments({
      name: req.params.name,
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      filter: req.query.filter,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const document = await getDocument(req.params.name, req.params.id);

    res.status(200).json({
      success: true,
      data: { document },
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const document = await createDocument(req.params.name, req.body);

    res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: { document },
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const document = await updateDocument(
      req.params.name,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Document updated successfully",
      data: { document },
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await deleteDocument(req.params.name, req.params.id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchema = async (req, res, next) => {
  try {
    const schema = await getCollectionSchema(
      req.params.name,
      req.query.sampleSize,
    );

    res.status(200).json({
      success: true,
      data: schema,
    });
  } catch (error) {
    next(error);
  }
};
