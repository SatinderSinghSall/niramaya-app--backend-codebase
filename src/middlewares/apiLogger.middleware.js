import ApiLog from "../models/apiLog.model.js";

export const apiLogger = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const responseTimeMs = Date.now() - startedAt;

    const adminId = req.admin?._id || null;

    const error = res.locals.apiError || null;

    ApiLog.create({
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      responseTimeMs,
      admin: adminId,

      ipAddress:
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        undefined,

      userAgent: req.headers["user-agent"] || undefined,

      errorCode: error?.code,
      errorMessage: error?.message,
    }).catch((loggingError) => {
      console.error("API request logging failed:", {
        name: loggingError.name,
        message: loggingError.message,
      });
    });
  });

  next();
};
