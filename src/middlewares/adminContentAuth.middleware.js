import Admin from "../models/admin.model.js";
import { verifyAdminAccessToken } from "../utils/admin.util.js";

const readBearerToken = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
};

export const authenticateAdminContent = async (req, res, next) => {
  try {
    const token = readBearerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin access token is required",
        code: "ADMIN_TOKEN_REQUIRED",
      });
    }

    const payload = verifyAdminAccessToken(token);

    if (payload.type !== "admin_access" || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin access token",
        code: "INVALID_ADMIN_TOKEN",
      });
    }

    const admin = await Admin.findById(payload.sub);

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Admin account is inactive or unavailable",
        code: "ADMIN_INACTIVE",
      });
    }

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin access token",
      code: "INVALID_ADMIN_TOKEN",
    });
  }
};

export const requireContentRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
        code: "ADMIN_FORBIDDEN",
      });
    }
    next();
  };
