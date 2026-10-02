import mongoose from "mongoose";

const yogaSchema = new mongoose.Schema(
  {
    // ─────────────────────────
    // BASIC INFORMATION
    // ─────────────────────────

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    // ─────────────────────────
    // MEDIA
    // ─────────────────────────

    imageUrl: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    videoUrl: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // ─────────────────────────
    // CLASSIFICATION
    // ─────────────────────────

    type: {
      type: String,
      enum: [
        "pose",
        "practice",
        "routine",
        "breathing",
        "meditation",
        "knowledge",
      ],
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "stress_relief",
        "sleep",
        "flexibility",
        "strength",
        "mobility",
        "digestion",
        "energy",
        "balance",
        "relaxation",
        "mental_wellbeing",
        "general_wellness",
      ],
      required: true,
      index: true,
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
      index: true,
    },

    // ─────────────────────────
    // DURATION & PRACTICE
    // ─────────────────────────

    durationMinutes: {
      type: Number,
      min: 1,
      max: 180,
    },

    equipment: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    bodyFocus: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // ─────────────────────────
    // CONTENT
    // ─────────────────────────

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    benefits: [
      {
        type: String,
        trim: true,
        maxlength: 300,
      },
    ],

    instructions: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],

    precautions: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],

    contraindications: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],

    suitableFor: [
      {
        type: String,
        trim: true,
      },
    ],

    // ─────────────────────────
    // PERSONALIZATION
    // ─────────────────────────

    recommendedFor: {
      energyLevels: [String],
      stressLevels: [String],
      sleepQualities: [String],
      activityLevels: [String],
      yogaExperience: [String],
      concerns: [String],
      goalCategories: [String],
    },

    // ─────────────────────────
    // CONTENT MANAGEMENT
    // ─────────────────────────

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Yoga = mongoose.model("Yoga", yogaSchema);

export default Yoga;
