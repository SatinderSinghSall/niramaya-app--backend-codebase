import mongoose from "mongoose";

const yogaSchema = new mongoose.Schema(
  {
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

    durationMinutes: {
      type: Number,
      min: 1,
      max: 180,
    },

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

    recommendedFor: {
      energyLevels: [
        {
          type: String,
          trim: true,
        },
      ],

      stressLevels: [
        {
          type: String,
          trim: true,
        },
      ],

      sleepQualities: [
        {
          type: String,
          trim: true,
        },
      ],

      activityLevels: [
        {
          type: String,
          trim: true,
        },
      ],

      yogaExperience: [
        {
          type: String,
          trim: true,
        },
      ],

      concerns: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],

      goalCategories: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

yogaSchema.index({
  type: 1,
  category: 1,
  isActive: 1,
});

yogaSchema.index({
  difficulty: 1,
  isActive: 1,
});

yogaSchema.index({
  "recommendedFor.goalCategories": 1,
});

yogaSchema.index({
  tags: 1,
});

const Yoga = mongoose.model("Yoga", yogaSchema);

export default Yoga;
