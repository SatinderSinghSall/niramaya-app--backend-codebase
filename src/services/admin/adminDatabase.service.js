import mongoose from "mongoose";

const SYSTEM_COLLECTIONS = new Set([
  "system.views",
  "system.profile",
  "system.users",
  "system.js",
]);

const getDb = () => {
  const db = mongoose.connection.db;
  if (!db) {
    const error = new Error("MongoDB connection is not ready");
    error.statusCode = 503;
    error.code = "DB_NOT_READY";
    throw error;
  }
  return db;
};

const validateCollectionName = (name) => {
  if (!name || typeof name !== "string" || SYSTEM_COLLECTIONS.has(name)) {
    const error = new Error("Invalid collection name");
    error.statusCode = 400;
    error.code = "INVALID_COLLECTION";
    throw error;
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(name)) {
    const error = new Error("Invalid collection name");
    error.statusCode = 400;
    error.code = "INVALID_COLLECTION";
    throw error;
  }

  return name;
};

const getCollection = (name) =>
  getDb().collection(validateCollectionName(name));

const serialize = (value) => {
  if (value === null || value === undefined) return value;

  if (value instanceof mongoose.Types.ObjectId) {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) return value.map(serialize);

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serialize(item)]),
    );
  }

  return value;
};

const parseObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid document id");
    error.statusCode = 400;
    error.code = "INVALID_DOCUMENT_ID";
    throw error;
  }

  return new mongoose.Types.ObjectId(id);
};

const buildSearchFilter = (search) => {
  if (!search?.trim()) return {};

  const safe = search
    .trim()
    .slice(0, 100)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return {
    $or: [
      { _id: { $regex: safe, $options: "i" } },
      { firstName: { $regex: safe, $options: "i" } },
      { lastName: { $regex: safe, $options: "i" } },
      { email: { $regex: safe, $options: "i" } },
      { title: { $regex: safe, $options: "i" } },
      { slug: { $regex: safe, $options: "i" } },
      { name: { $regex: safe, $options: "i" } },
      { status: { $regex: safe, $options: "i" } },
      { category: { $regex: safe, $options: "i" } },
      { type: { $regex: safe, $options: "i" } },
    ],
  };
};

const parseFilter = (filter) => {
  if (!filter) return {};

  try {
    const parsed = JSON.parse(filter);

    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      throw new Error();
    }

    return parsed;
  } catch {
    const error = new Error("Invalid filter JSON");
    error.statusCode = 400;
    error.code = "INVALID_FILTER";
    throw error;
  }
};

export const listCollections = async () => {
  const db = getDb();

  const collections = await db.listCollections({}).toArray();

  const visible = collections
    .map((collection) => collection.name)
    .filter((name) => !SYSTEM_COLLECTIONS.has(name))
    .sort();

  const result = await Promise.all(
    visible.map(async (name) => ({
      name,
      documents: await db.collection(name).estimatedDocumentCount(),
    })),
  );

  return result;
};

export const getCollectionOverview = async (name) => {
  const collection = getCollection(name);
  const documents = await collection.estimatedDocumentCount();

  const indexes = await collection.indexes();

  return {
    name,
    documents,
    indexes: indexes.map((index) => ({
      name: index.name,
      key: index.key,
      unique: Boolean(index.unique),
      sparse: Boolean(index.sparse),
    })),
  };
};

export const getCollectionDocuments = async ({
  name,
  page = 1,
  limit = 25,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  filter,
}) => {
  const collection = getCollection(name);

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const sortDirection = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;

  const parsedFilter = parseFilter(filter);
  const searchFilter = buildSearchFilter(search);

  const query =
    Object.keys(searchFilter).length && Object.keys(parsedFilter).length
      ? { $and: [parsedFilter, searchFilter] }
      : { ...parsedFilter, ...searchFilter };

  const [documents, total] = await Promise.all([
    collection
      .find(query)
      .sort({ [sortBy]: sortDirection })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .toArray(),
    collection.countDocuments(query),
  ]);

  return {
    collection: name,
    documents: documents.map(serialize),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
    sort: {
      field: sortBy,
      order: sortDirection === 1 ? "asc" : "desc",
    },
  };
};

export const getDocument = async (name, id) => {
  const document = await getCollection(name).findOne({
    _id: parseObjectId(id),
  });

  if (!document) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    error.code = "DOCUMENT_NOT_FOUND";
    throw error;
  }

  return serialize(document);
};

export const createDocument = async (name, data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    const error = new Error("Document body must be a JSON object");
    error.statusCode = 400;
    error.code = "INVALID_DOCUMENT";
    throw error;
  }

  const result = await getCollection(name).insertOne(data);
  return getDocument(name, result.insertedId.toString());
};

export const updateDocument = async (name, id, data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    const error = new Error("Document body must be a JSON object");
    error.statusCode = 400;
    error.code = "INVALID_DOCUMENT";
    throw error;
  }

  const { _id, ...updates } = data;

  const result = await getCollection(name).updateOne(
    { _id: parseObjectId(id) },
    { $set: updates },
  );

  if (!result.matchedCount) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    error.code = "DOCUMENT_NOT_FOUND";
    throw error;
  }

  return getDocument(name, id);
};

export const deleteDocument = async (name, id) => {
  const result = await getCollection(name).deleteOne({
    _id: parseObjectId(id),
  });

  if (!result.deletedCount) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    error.code = "DOCUMENT_NOT_FOUND";
    throw error;
  }

  return { deleted: true, id };
};

export const getCollectionSchema = async (name, sampleSize = 100) => {
  const collection = getCollection(name);

  const safeSampleSize = Math.min(Math.max(Number(sampleSize) || 100, 1), 500);
  const sample = await collection
    .aggregate([{ $sample: { size: safeSampleSize } }])
    .toArray();

  const fields = new Map();

  const register = (path, value) => {
    const type = Array.isArray(value)
      ? "array"
      : value === null
        ? "null"
        : value instanceof mongoose.Types.ObjectId
          ? "objectId"
          : value instanceof Date
            ? "date"
            : typeof value;

    const current = fields.get(path) || {
      field: path,
      types: new Set(),
      occurrences: 0,
      examples: [],
    };

    current.types.add(type);
    current.occurrences += 1;

    if (current.examples.length < 3 && value !== undefined) {
      const serialized = serialize(value);
      if (
        !current.examples.some(
          (item) => JSON.stringify(item) === JSON.stringify(serialized),
        )
      ) {
        current.examples.push(serialized);
      }
    }

    fields.set(path, current);

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof mongoose.Types.ObjectId)
    ) {
      for (const [key, child] of Object.entries(value)) {
        register(`${path}.${key}`, child);
      }
    }
  };

  for (const document of sample) {
    for (const [key, value] of Object.entries(document)) {
      register(key, value);
    }
  }

  const total = await collection.estimatedDocumentCount();

  return {
    collection: name,
    sampledDocuments: sample.length,
    totalDocuments: total,
    fields: [...fields.values()]
      .map((field) => ({
        ...field,
        types: [...field.types],
      }))
      .sort((a, b) => a.field.localeCompare(b.field)),
  };
};
