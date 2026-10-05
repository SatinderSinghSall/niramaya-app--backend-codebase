import mongoose from "mongoose";
import Admin from "../../models/admin.model.js";
import { hashAdminPassword, sanitizeAdmin } from "../../utils/admin.util.js";

const ROLES = ["super_admin", "admin", "content_manager", "support"];

const DEFAULT_PERMISSIONS = {
  super_admin: ["*"],
  admin: [
    "dashboard:read",
    "users:read",
    "users:write",
    "content:read",
    "content:write",
    "consultations:read",
    "notifications:write",
  ],
  content_manager: ["dashboard:read", "content:read", "content:write"],
  support: ["dashboard:read", "users:read", "consultations:read"],
};

function normalizePermissions(permissions, role) {
  if (permissions === undefined) return DEFAULT_PERMISSIONS[role] || [];
  if (!Array.isArray(permissions)) {
    const error = new Error("Permissions must be an array");
    error.statusCode = 400;
    throw error;
  }
  return [...new Set(permissions.map((p) => String(p).trim()).filter(Boolean))];
}

function validateRole(role) {
  if (!ROLES.includes(role)) {
    const error = new Error(
      `Invalid admin role. Allowed roles: ${ROLES.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }
}

async function countActiveSuperAdmins() {
  return Admin.countDocuments({
    role: "super_admin",
    isActive: true,
  });
}
async function assertCanMutateTarget(actor, target, action) {
  if (!actor || !target) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }

  if (actor._id.toString() === target._id.toString() && action === "delete") {
    const error = new Error("You cannot delete your own admin account");
    error.statusCode = 400;
    throw error;
  }

  if (target.role === "super_admin" && actor.role !== "super_admin") {
    const error = new Error(
      "Only a super_admin can modify another super_admin",
    );
    error.statusCode = 403;
    throw error;
  }

  if (
    action === "role" &&
    target._id.toString() === actor._id.toString() &&
    target.role === "super_admin"
  ) {
    const error = new Error(
      "A super_admin cannot remove their own super_admin role",
    );
    error.statusCode = 400;
    throw error;
  }
}

export async function listAdmins({
  page = 1,
  limit = 25,
  search,
  role,
  isActive,
}) {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 25, 1), 100);

  const filter = {};
  if (role) {
    validateRole(role);
    filter.role = role;
  }
  if (isActive !== undefined && isActive !== "") {
    filter.isActive = String(isActive) === "true";
  }
  if (search?.trim()) {
    const regex = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
    filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }];
  }

  const [items, total] = await Promise.all([
    Admin.find(filter)
      .select("-password -refreshTokenHash")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Admin.countDocuments(filter),
  ]);

  return {
    items: items.map(sanitizeAdmin),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getAdmin(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid admin id");
    error.statusCode = 400;
    throw error;
  }

  const admin = await Admin.findById(id)
    .select("-password -refreshTokenHash")
    .lean();
  if (!admin) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }
  return sanitizeAdmin(admin);
}

export async function createAdmin({ actor, data }) {
  if (!["super_admin", "admin"].includes(actor.role)) {
    const error = new Error("Insufficient permission to create admins");
    error.statusCode = 403;
    throw error;
  }

  const {
    firstName,
    lastName,
    email,
    password,
    role = "support",
    permissions,
    isActive = true,
  } = data || {};
  if (!firstName || !lastName || !email || !password) {
    const error = new Error(
      "firstName, lastName, email and password are required",
    );
    error.statusCode = 400;
    throw error;
  }

  validateRole(role);
  if (actor.role !== "super_admin" && role === "super_admin") {
    const error = new Error(
      "Only a super_admin can create another super_admin",
    );
    error.statusCode = 403;
    throw error;
  }

  const existing = await Admin.findOne({
    email: String(email).trim().toLowerCase(),
  }).select("_id");
  if (existing) {
    const error = new Error("An admin with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const admin = await Admin.create({
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    email: String(email).trim().toLowerCase(),
    password: await hashAdminPassword(password),
    role,
    permissions: normalizePermissions(permissions, role),
    isActive: Boolean(isActive),
  });

  return sanitizeAdmin(admin.toObject());
}

export async function updateAdmin({ actor, id, data }) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid admin id");
    error.statusCode = 400;
    throw error;
  }

  const target = await Admin.findById(id).select("+password +refreshTokenHash");
  if (!target) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }

  await assertCanMutateTarget(actor, target, "update");

  if (data.role !== undefined) {
    validateRole(data.role);
    if (actor.role !== "super_admin") {
      const error = new Error("Only a super_admin can change admin roles");
      error.statusCode = 403;
      throw error;
    }
    if (
      actor._id.toString() === target._id.toString() &&
      data.role !== "super_admin"
    ) {
      const error = new Error(
        "A super_admin cannot remove their own super_admin role",
      );
      error.statusCode = 400;
      throw error;
    }
  }

  if (
    data.isActive !== undefined &&
    actor._id.toString() === target._id.toString() &&
    data.isActive === false
  ) {
    const error = new Error("You cannot deactivate your own admin account");
    error.statusCode = 400;
    throw error;
  }

  if (data.isActive === false && target.role === "super_admin") {
    const activeSuperAdmins = await countActiveSuperAdmins();
    if (activeSuperAdmins <= 1) {
      const error = new Error("Cannot deactivate the last active super_admin");
      error.statusCode = 400;
      throw error;
    }
  }

  if (data.firstName !== undefined)
    target.firstName = String(data.firstName).trim();
  if (data.lastName !== undefined)
    target.lastName = String(data.lastName).trim();
  if (data.email !== undefined)
    target.email = String(data.email).trim().toLowerCase();
  if (data.role !== undefined) target.role = data.role;
  if (data.permissions !== undefined)
    target.permissions = normalizePermissions(data.permissions, target.role);
  if (data.isActive !== undefined) target.isActive = Boolean(data.isActive);

  if (data.password) {
    target.password = await hashAdminPassword(data.password);
    target.refreshTokenHash = undefined;
  }

  await target.save();
  return sanitizeAdmin(target.toObject());
}

export async function updateAdminStatus({ actor, id, isActive }) {
  return updateAdmin({ actor, id, data: { isActive: Boolean(isActive) } });
}

export async function deleteAdmin({ actor, id }) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid admin id");
    error.statusCode = 400;
    throw error;
  }

  const target = await Admin.findById(id);
  if (!target) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }

  await assertCanMutateTarget(actor, target, "delete");

  if (target.role === "super_admin") {
    const activeSuperAdmins = await countActiveSuperAdmins();
    if (target.isActive && activeSuperAdmins <= 1) {
      const error = new Error("Cannot delete the last active super_admin");
      error.statusCode = 400;
      throw error;
    }
  }

  await Admin.deleteOne({ _id: target._id });
  return { id: target._id, deleted: true };
}

export async function getAdminRoles() {
  return ROLES.map((role) => ({
    role,
    defaultPermissions: DEFAULT_PERMISSIONS[role] || [],
  }));
}
