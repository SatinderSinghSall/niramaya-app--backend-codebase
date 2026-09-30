import mongoose from "mongoose";

const healthProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // -------------------------
    // Personal Information
    // -------------------------
    personal: {
      dateOfBirth: {
        type: Date,
        default: null,
      },

      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer_not_to_say"],
        default: null,
      },

      heightCm: {
        type: Number,
        min: 30,
        max: 300,
        default: null,
      },

      weightKg: {
        type: Number,
        min: 1,
        max: 500,
        default: null,
      },

      occupation: {
        type: String,
        trim: true,
        maxlength: 100,
        default: null,
      },
    },

    // -------------------------
    // Physical Health
    // -------------------------
    physicalHealth: {
      energyLevel: {
        type: String,
        enum: ["very_low", "low", "moderate", "high", "very_high"],
        default: null,
      },

      digestion: {
        type: String,
        enum: ["poor", "below_average", "normal", "good", "very_good"],
        default: null,
      },

      skinConcerns: {
        type: [String],
        default: [],
      },

      hairConcerns: {
        type: [String],
        default: [],
      },

      bodyPainAreas: {
        type: [String],
        default: [],
      },

      otherConcerns: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: null,
      },
    },

    // -------------------------
    // Mental & Emotional Wellbeing
    // -------------------------
    wellbeing: {
      stressLevel: {
        type: String,
        enum: ["very_low", "low", "moderate", "high", "very_high"],
        default: null,
      },

      mood: {
        type: String,
        enum: ["very_low", "low", "neutral", "good", "very_good"],
        default: null,
      },

      focusLevel: {
        type: String,
        enum: ["very_low", "low", "moderate", "high", "very_high"],
        default: null,
      },

      relaxationLevel: {
        type: String,
        enum: ["very_low", "low", "moderate", "high", "very_high"],
        default: null,
      },
    },

    // -------------------------
    // Lifestyle
    // -------------------------
    lifestyle: {
      activityLevel: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active", "very_active"],
        default: null,
      },

      smoking: {
        type: String,
        enum: ["never", "former", "occasional", "regular"],
        default: null,
      },

      alcoholConsumption: {
        type: String,
        enum: ["none", "occasional", "regular"],
        default: null,
      },

      waterIntakeLiters: {
        type: Number,
        min: 0,
        max: 20,
        default: null,
      },

      dailyScreenTimeHours: {
        type: Number,
        min: 0,
        max: 24,
        default: null,
      },
    },

    // -------------------------
    // Nutrition
    // -------------------------
    nutrition: {
      dietType: {
        type: String,
        enum: ["vegetarian", "vegan", "eggetarian", "non_vegetarian", "other"],
        default: null,
      },

      mealsPerDay: {
        type: Number,
        min: 1,
        max: 10,
        default: null,
      },

      dietaryPreferences: {
        type: [String],
        default: [],
      },

      foodAllergies: {
        type: [String],
        default: [],
      },

      waterConsumption: {
        type: String,
        enum: ["low", "moderate", "high"],
        default: null,
      },
    },

    // -------------------------
    // Sleep
    // -------------------------
    sleep: {
      averageHours: {
        type: Number,
        min: 0,
        max: 24,
        default: null,
      },

      sleepQuality: {
        type: String,
        enum: ["very_poor", "poor", "average", "good", "very_good"],
        default: null,
      },

      bedtime: {
        type: String,
        default: null,
      },

      wakeTime: {
        type: String,
        default: null,
      },

      sleepDifficulties: {
        type: [String],
        default: [],
      },
    },

    // -------------------------
    // Fitness & Activity
    // -------------------------
    fitness: {
      exerciseFrequency: {
        type: String,
        enum: ["never", "rarely", "1_2_days", "3_4_days", "5_plus_days"],
        default: null,
      },

      exerciseTypes: {
        type: [String],
        default: [],
      },

      yogaExperience: {
        type: String,
        enum: ["none", "beginner", "intermediate", "advanced"],
        default: null,
      },

      averageDailySteps: {
        type: Number,
        min: 0,
        max: 100000,
        default: null,
      },
    },

    // -------------------------
    // Medical History
    // -------------------------
    medicalHistory: {
      existingConditions: {
        type: [String],
        default: [],
      },

      allergies: {
        type: [String],
        default: [],
      },

      currentMedications: {
        type: [String],
        default: [],
      },

      previousSurgeries: {
        type: [String],
        default: [],
      },

      familyHistory: {
        type: [String],
        default: [],
      },

      additionalInformation: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: null,
      },
    },

    // -------------------------
    // User Preferences
    // -------------------------
    preferences: {
      preferredYogaDuration: {
        type: Number,
        min: 1,
        max: 180,
        default: null,
      },

      preferredActivityTime: {
        type: String,
        enum: ["morning", "afternoon", "evening", "night", "anytime"],
        default: null,
      },

      wellnessInterests: {
        type: [String],
        default: [],
      },
    },

    // -------------------------
    // Onboarding Status
    // -------------------------
    onboarding: {
      completed: {
        type: Boolean,
        default: false,
      },

      completedAt: {
        type: Date,
        default: null,
      },

      completionPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

const HealthProfile = mongoose.model("HealthProfile", healthProfileSchema);

export default HealthProfile;
