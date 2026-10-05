import ApiLog from "../../models/apiLog.model.js";

function createBadRequest(message, code = "INVALID_REQUEST") {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = code;
  return error;
}

function createNotFound(message = "API log not found") {
  const error = new Error(message);
  error.statusCode = 404;
  error.code = "API_LOG_NOT_FOUND";
  return error;
}

function normalizePage(value) {
  const page = Number.parseInt(value, 10);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}

function normalizeLimit(value) {
  const limit = Number.parseInt(value, 10);

  if (!Number.isFinite(limit)) {
    return 25;
  }

  return Math.min(Math.max(limit, 1), 100);
}

function buildSearchFilter(search) {
  const trimmed = typeof search === "string" ? search.trim() : "";

  if (!trimmed) {
    return {};
  }

  const regex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  return {
    $or: [
      { method: regex },
      { route: regex },
      { errorCode: regex },
      { errorMessage: regex },
      { ipAddress: regex },
      { userAgent: regex },
    ],
  };
}

function buildStatusFilter(status) {
  if (!status) {
    return {};
  }

  switch (status) {
    case "success":
      return {
        statusCode: {
          $gte: 200,
          $lt: 300,
        },
      };

    case "redirect":
      return {
        statusCode: {
          $gte: 300,
          $lt: 400,
        },
      };

    case "client_error":
      return {
        statusCode: {
          $gte: 400,
          $lt: 500,
        },
      };

    case "server_error":
      return {
        statusCode: {
          $gte: 500,
          $lt: 600,
        },
      };

    default:
      throw createBadRequest(
        "Invalid status filter. Use success, redirect, client_error or server_error.",
        "INVALID_STATUS_FILTER",
      );
  }
}

function buildMethodFilter(method) {
  if (!method) {
    return {};
  }

  const normalizedMethod = String(method).trim().toUpperCase();

  const allowedMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
    "HEAD",
  ];

  if (!allowedMethods.includes(normalizedMethod)) {
    throw createBadRequest(
      "Invalid HTTP method filter.",
      "INVALID_METHOD_FILTER",
    );
  }

  return {
    method: normalizedMethod,
  };
}

function buildAdminFilter(adminId) {
  if (!adminId) {
    return {};
  }

  return {
    admin: adminId,
  };
}

function buildDateFilter(startDate, endDate) {
  const filter = {};

  if (startDate) {
    const parsedStart = new Date(startDate);

    if (Number.isNaN(parsedStart.getTime())) {
      throw createBadRequest("Invalid startDate.", "INVALID_START_DATE");
    }

    filter.$gte = parsedStart;
  }

  if (endDate) {
    const parsedEnd = new Date(endDate);

    if (Number.isNaN(parsedEnd.getTime())) {
      throw createBadRequest("Invalid endDate.", "INVALID_END_DATE");
    }

    filter.$lte = parsedEnd;
  }

  if (filter.$gte && filter.$lte && filter.$gte > filter.$lte) {
    throw createBadRequest(
      "startDate cannot be later than endDate.",
      "INVALID_DATE_RANGE",
    );
  }

  return Object.keys(filter).length ? { createdAt: filter } : {};
}

export const listApiLogs = async (query = {}) => {
  const page = normalizePage(query.page);
  const limit = normalizeLimit(query.limit);

  const search = typeof query.search === "string" ? query.search : "";
  const method = typeof query.method === "string" ? query.method : "";
  const status = typeof query.status === "string" ? query.status : "";
  const adminId = typeof query.adminId === "string" ? query.adminId : "";
  const startDate = typeof query.startDate === "string" ? query.startDate : "";
  const endDate = typeof query.endDate === "string" ? query.endDate : "";

  const filters = [
    buildSearchFilter(search),
    buildMethodFilter(method),
    buildStatusFilter(status),
    buildAdminFilter(adminId),
    buildDateFilter(startDate, endDate),
  ].filter((filter) => Object.keys(filter).length > 0);

  const mongoFilter =
    filters.length === 1
      ? filters[0]
      : filters.length > 1
        ? { $and: filters }
        : {};

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    ApiLog.find(mongoFilter)
      .populate({
        path: "admin",
        select: "firstName lastName email role",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    ApiLog.countDocuments(mongoFilter),
  ]);

  const pages = total > 0 ? Math.ceil(total / limit) : 0;

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNextPage: page < pages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getApiLogById = async (id) => {
  if (!id) {
    throw createBadRequest("API log ID is required.", "API_LOG_ID_REQUIRED");
  }

  const log = await ApiLog.findById(id)
    .populate({
      path: "admin",
      select: "firstName lastName email role",
    })
    .lean();

  if (!log) {
    throw createNotFound();
  }

  return log;
};

export const deleteApiLog = async (id) => {
  if (!id) {
    throw createBadRequest("API log ID is required.", "API_LOG_ID_REQUIRED");
  }

  const log = await ApiLog.findByIdAndDelete(id).lean();

  if (!log) {
    throw createNotFound();
  }

  return log;
};
