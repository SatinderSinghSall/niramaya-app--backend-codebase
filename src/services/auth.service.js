import User from "../models/user.model.js";
import {
  comparePassword,
  compareToken,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  hashToken,
} from "../utils/auth.util.js";

export const registerUser = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("An account with this email already exists");

    error.statusCode = 409;

    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone: phone || null,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokenHash = await hashToken(refreshToken);

  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select(
    "+password +refreshTokenHash",
  );

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("User account is inactive");
    error.statusCode = 403;
    throw error;
  }

  const passwordMatches = await comparePassword(password, user.password);

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokenHash = await hashToken(refreshToken);
  user.lastLoginAt = new Date();

  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshUserToken = async (refreshToken) => {
  const { verifyRefreshToken } = await import("../utils/auth.util.js");

  const payload = verifyRefreshToken(refreshToken);

  if (payload.type !== "refresh") {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(payload.sub).select("+refreshTokenHash");

  if (!user || !user.isActive || !user.refreshTokenHash) {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  const matches = await compareToken(refreshToken, user.refreshTokenHash);

  if (!matches) {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshTokenHash = await hashToken(newRefreshToken);

  await user.save();

  return {
    user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $set: {
      refreshTokenHash: null,
    },
  });
};
