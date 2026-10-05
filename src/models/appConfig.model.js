import mongoose from "mongoose";

const appConfigSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["android", "ios"],
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    latestVersion: {
      type: String,
      required: true,
      trim: true,
    },

    minSupportedVersion: {
      type: String,
      required: true,
      trim: true,
    },

    forceUpdate: {
      type: Boolean,
      default: false,
    },

    storeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    updateMessage: {
      type: String,
      trim: true,
      default:
        "A new version of Niramaya is available with improvements and new features.",
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AppConfig", appConfigSchema);
