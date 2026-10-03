export const errorHandler = (error, req, res, next) => {
  console.error("API Error:", {
    method: req.method,
    url: req.originalUrl,
    statusCode: error.statusCode,
    code: error.code,
    message: error.message,
    name: error.name,
  });

  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";
  let code = error.code || "INTERNAL_SERVER_ERROR";

  // ---------------------------------------------
  // Mongoose validation error
  // ---------------------------------------------
  if (error.name === "ValidationError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";

    const errors = {};

    Object.entries(error.errors || {}).forEach(([field, value]) => {
      errors[field] = value.message;
    });

    return res.status(statusCode).json({
      success: false,
      message: "Please correct the highlighted fields.",
      code,
      errors,
    });
  }

  // ---------------------------------------------
  // Mongoose duplicate key error
  // ---------------------------------------------
  if (error.code === 11000) {
    statusCode = 409;
    code = "DUPLICATE_RESOURCE";

    const duplicateFields = Object.keys(error.keyPattern || {});
    const field = duplicateFields[0];

    if (field === "email") {
      message = "An account with this email already exists";
      code = "EMAIL_ALREADY_EXISTS";
    } else {
      message = "A record with these details already exists";
    }
  }

  // ---------------------------------------------
  // Mongoose CastError
  // ---------------------------------------------
  if (error.name === "CastError") {
    statusCode = 400;
    code = "INVALID_ID";
    message = "The requested resource ID is invalid.";
  }

  // ---------------------------------------------
  // JWT errors
  // ---------------------------------------------
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    code = "INVALID_TOKEN";
    message = "Invalid authentication token.";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    code = "TOKEN_EXPIRED";
    message = "Your session has expired. Please sign in again.";
  }

  // ---------------------------------------------
  // Database / infrastructure errors
  // ---------------------------------------------
  const databaseError =
    error.name === "MongoServerSelectionError" ||
    error.name === "MongooseServerSelectionError" ||
    error.name === "MongoNetworkError" ||
    error.name === "MongoNetworkTimeoutError";

  if (databaseError) {
    statusCode = 503;
    code = "DATABASE_UNAVAILABLE";
    message = "Service is temporarily unavailable. Please try again later.";
  }

  // ---------------------------------------------
  // Never expose internal details for 5xx errors
  // ---------------------------------------------
  if (statusCode >= 500) {
    message = "Server Error. Please try again later.";
    code = "INTERNAL_SERVER_ERROR";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    code,
  });
};
