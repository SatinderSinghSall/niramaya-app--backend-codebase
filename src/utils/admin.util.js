import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;

const getAdminAccessSecret = () =>
  env.jwtAdminAccessSecret || env.jwtAccessSecret;

const getAdminRefreshSecret = () =>
  env.jwtAdminRefreshSecret || env.jwtRefreshSecret;

export const hashAdminPassword = async (password) =>
  bcrypt.hash(password, SALT_ROUNDS);

export const compareAdminPassword = async (password, hash) =>
  bcrypt.compare(password, hash);

export const generateAdminAccessToken = (adminId) =>
  jwt.sign(
    { sub: adminId.toString(), type: "admin_access" },
    getAdminAccessSecret(),
    { expiresIn: env.jwtAdminAccessExpiresIn || "15m" },
  );

export const generateAdminRefreshToken = (adminId) =>
  jwt.sign(
    { sub: adminId.toString(), type: "admin_refresh" },
    getAdminRefreshSecret(),
    { expiresIn: env.jwtAdminRefreshExpiresIn || "30d" },
  );

export const verifyAdminAccessToken = (token) =>
  jwt.verify(token, getAdminAccessSecret());

export const verifyAdminRefreshToken = (token) =>
  jwt.verify(token, getAdminRefreshSecret());

export const hashAdminToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const compareAdminToken = (token, hash) =>
  hashAdminToken(token) === hash;

export const sanitizeAdmin = (admin) => {
  if (!admin) return null;

  const source = admin.toObject ? admin.toObject() : admin;

  return {
    id: source._id?.toString?.() || source.id,
    firstName: source.firstName,
    lastName: source.lastName,
    email: source.email,
    role: source.role,
    permissions: source.permissions || [],
    isActive: source.isActive,
    lastLoginAt: source.lastLoginAt || null,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
};
