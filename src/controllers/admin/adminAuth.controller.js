import {
  getAdminById,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} from "../../services/admin/adminAuth.service.js";
import { sanitizeAdmin } from "../../utils/admin.util.js";

export const login = async (req, res, next) => {
  try {
    const result = await loginAdmin(req.body);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        admin: sanitizeAdmin(result.admin),
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error("Refresh token is required");
      error.statusCode = 400;
      error.code = "REFRESH_TOKEN_REQUIRED";
      throw error;
    }

    const result = await refreshAdminToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Admin token refreshed successfully",
      data: {
        admin: sanitizeAdmin(result.admin),
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutAdmin(req.admin._id);

    res.status(200).json({
      success: true,
      message: "Admin logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const admin = await getAdminById(req.admin._id);

    res.status(200).json({
      success: true,
      data: {
        admin: sanitizeAdmin(admin),
      },
    });
  } catch (error) {
    next(error);
  }
};
