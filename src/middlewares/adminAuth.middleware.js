import Admin from "../models/admin.model.js";
import { verifyAdminAccessToken } from "../utils/admin.util.js";

export const authenticateAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      const error = new Error("Admin authentication required");
      error.statusCode = 401;
      error.code = "ADMIN_AUTH_REQUIRED";
      throw error;
    }

    const token = header.substring(7);
    const payload = verifyAdminAccessToken(token);

    if (payload.type !== "admin_access") {
      const error = new Error("Invalid admin access token");
      error.statusCode = 401;
      error.code = "INVALID_ADMIN_TOKEN";
      throw error;
    }

    const admin = await Admin.findById(payload.sub);

    if (!admin) {
      const error = new Error("Admin not found");
      error.statusCode = 401;
      error.code = "ADMIN_NOT_FOUND";
      throw error;
    }

    if (!admin.isActive) {
      const error = new Error("Admin account is inactive");
      error.statusCode = 403;
      error.code = "ADMIN_INACTIVE";
      throw error;
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      error.statusCode = 401;
      error.code = "INVALID_ADMIN_TOKEN";
      error.message =
        error.name === "TokenExpiredError"
          ? "Admin access token expired"
          : "Invalid admin access token";
    }

    next(error);
  }
};

export const requireAdminRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      const error = new Error("Admin authentication required");
      error.statusCode = 401;
      error.code = "ADMIN_AUTH_REQUIRED";
      return next(error);
    }

    if (!allowedRoles.includes(req.admin.role)) {
      const error = new Error(
        "You do not have permission to perform this action",
      );
      error.statusCode = 403;
      error.code = "ADMIN_FORBIDDEN";
      return next(error);
    }

    next();
  };
};
