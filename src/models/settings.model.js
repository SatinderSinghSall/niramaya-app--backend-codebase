import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    notifications: {
      enabled: {
        type: Boolean,
        default: true,
      },

      goalReminders: {
        type: Boolean,
        default: true,
      },

      progressReminders: {
        type: Boolean,
        default: true,
      },

      consultationUpdates: {
        type: Boolean,
        default: true,
      },

      wellnessReminders: {
        type: Boolean,
        default: true,
      },
    },

    reminders: {
      enabled: {
        type: Boolean,
        default: true,
      },

      preferredTime: {
        type: String,
        default: "08:00",
        trim: true,
      },
    },

    appearance: {
      theme: {
        type: String,
        enum: ["system", "light", "dark"],
        default: "system",
      },
    },

    privacy: {
      analyticsEnabled: {
        type: Boolean,
        default: true,
      },
    },

    preferences: {
      language: {
        type: String,
        default: "en",
        trim: true,
      },

      timezone: {
        type: String,
        default: "Asia/Kolkata",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
