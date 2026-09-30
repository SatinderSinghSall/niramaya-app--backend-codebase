import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "sleep",
        "stress_management",
        "fitness",
        "flexibility",
        "strength",
        "weight_management",
        "digestion",
        "energy",
        "mental_wellbeing",
        "mobility",
        "skin_wellness",
        "hair_wellness",
        "general_wellbeing",
        "other",
      ],
    },

    target: {
      value: {
        type: Number,
        default: null,
      },

      unit: {
        type: String,
        trim: true,
        default: null,
      },

      description: {
        type: String,
        trim: true,
        maxlength: 200,
        default: null,
      },
    },

    currentValue: {
      type: Number,
      default: 0,
    },

    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    targetDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "paused", "completed", "cancelled"],
      default: "active",
    },

    completedAt: {
      type: Date,
      default: null,
    },

    milestones: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100,
        },

        targetValue: {
          type: Number,
          default: null,
        },

        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

goalSchema.index({
  user: 1,
  status: 1,
});

goalSchema.index({
  user: 1,
  category: 1,
});

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
