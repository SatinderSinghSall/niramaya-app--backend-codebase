import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "content_manager", "support"],
      default: "admin",
      index: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

adminSchema.index({ role: 1, isActive: 1 });

export default mongoose.model("Admin", adminSchema);
