import Admin from "../../models/admin.model.js";
import {
  compareAdminPassword,
  compareAdminToken,
  generateAdminAccessToken,
  generateAdminRefreshToken,
  hashAdminPassword,
  hashAdminToken,
  verifyAdminRefreshToken,
} from "../../utils/admin.util.js";

const createError = (message, statusCode, code) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

export const registerInitialAdmin = async ({
  firstName,
  lastName,
  email,
  password,
  role = "super_admin",
  permissions = [],
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await Admin.findOne({ email: normalizedEmail });
  if (existing) {
    throw createError("Admin already exists", 409, "ADMIN_EXISTS");
  }

  const passwordHash = await hashAdminPassword(password);

  return Admin.create({
    firstName,
    lastName,
    email: normalizedEmail,
    password: passwordHash,
    role,
    permissions,
  });
};

export const loginAdmin = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const admin = await Admin.findOne({ email: normalizedEmail }).select(
    "+password +refreshTokenHash",
  );

  if (!admin) {
    throw createError("Invalid admin credentials", 401, "INVALID_CREDENTIALS");
  }

  if (!admin.isActive) {
    throw createError("Admin account is inactive", 403, "ADMIN_INACTIVE");
  }

  const validPassword = await compareAdminPassword(password, admin.password);
  if (!validPassword) {
    throw createError("Invalid admin credentials", 401, "INVALID_CREDENTIALS");
  }

  const accessToken = generateAdminAccessToken(admin._id);
  const refreshToken = generateAdminRefreshToken(admin._id);

  admin.refreshTokenHash = hashAdminToken(refreshToken);
  admin.lastLoginAt = new Date();
  await admin.save();

  return { admin, accessToken, refreshToken };
};

export const refreshAdminToken = async (refreshToken) => {
  let payload;

  try {
    payload = verifyAdminRefreshToken(refreshToken);
  } catch {
    throw createError(
      "Invalid or expired refresh token",
      401,
      "INVALID_REFRESH_TOKEN",
    );
  }

  if (payload.type !== "admin_refresh") {
    throw createError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const admin = await Admin.findById(payload.sub).select("+refreshTokenHash");

  if (!admin || !admin.isActive || !admin.refreshTokenHash) {
    throw createError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  if (!compareAdminToken(refreshToken, admin.refreshTokenHash)) {
    throw createError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const newAccessToken = generateAdminAccessToken(admin._id);
  const newRefreshToken = generateAdminRefreshToken(admin._id);

  admin.refreshTokenHash = hashAdminToken(newRefreshToken);
  await admin.save();

  return {
    admin,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutAdmin = async (adminId) => {
  await Admin.findByIdAndUpdate(adminId, {
    $unset: { refreshTokenHash: 1 },
  });
};

export const getAdminById = async (adminId) => {
  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw createError("Admin not found", 404, "ADMIN_NOT_FOUND");
  }

  return admin;
};
