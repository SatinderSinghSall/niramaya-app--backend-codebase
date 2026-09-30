import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "goal",
        "progress",
        "consultation",
        "yoga",
        "ayurveda",
        "general",
        "system",
      ],
      default: "general",
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    action: {
      type: {
        type: String,
        enum: [
          "goal",
          "progress",
          "consultation",
          "yoga",
          "ayurveda",
          "dashboard",
          "none",
        ],
        default: "none",
      },

      referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      route: {
        type: String,
        trim: true,
        maxlength: 300,
      },
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  user: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  user: 1,
  createdAt: -1,
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
