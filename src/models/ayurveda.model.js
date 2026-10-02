import mongoose from "mongoose";

const ayurvedaSchema = new mongoose.Schema(
  {
    // ------------------------------------------------------------
    // Basic information
    // ------------------------------------------------------------

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

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // ------------------------------------------------------------
    // Content type
    // ------------------------------------------------------------

    type: {
      type: String,
      enum: [
        "practice",
        "herb",
        "product",
        "routine",
        "nutrition",
        "knowledge",
      ],
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "digestion",
        "stress",
        "sleep",
        "energy",
        "skin",
        "hair",
        "immunity",
        "fitness",
        "relaxation",
        "nutrition",
        "general_wellness",
      ],
      required: true,
      index: true,
    },

    // ------------------------------------------------------------
    // Media
    // ------------------------------------------------------------

    imageUrl: {
      type: String,
      trim: true,
    },

    videoUrl: {
      type: String,
      trim: true,
    },

    // ------------------------------------------------------------
    // Practice / routine information
    // ------------------------------------------------------------

    durationMinutes: {
      type: Number,
      min: 1,
      max: 1440,
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },

    bestTime: [
      {
        type: String,
        trim: true,
      },
    ],

    frequency: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    duration: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    preparation: {
      type: String,
      trim: true,
      maxlength: 1500,
    },

    usage: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    howToUse: [
      {
        type: String,
        trim: true,
        maxlength: 1000,
      },
    ],

    // ------------------------------------------------------------
    // Ayurveda-specific information
    // ------------------------------------------------------------

    doshas: [
      {
        type: String,
        enum: ["vata", "pitta", "kapha", "tridoshic"],
      },
    ],

    prakriti: [
      {
        type: String,
        enum: ["vata", "pitta", "kapha", "tridoshic"],
      },
    ],

    properties: {
      rasa: [
        {
          type: String,
          trim: true,
        },
      ],

      guna: [
        {
          type: String,
          trim: true,
        },
      ],

      virya: {
        type: String,
        trim: true,
      },

      vipaka: {
        type: String,
        trim: true,
      },
    },

    // ------------------------------------------------------------
    // Wellness information
    // ------------------------------------------------------------

    bodySystems: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    wellnessGoals: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

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

    suitableFor: [
      {
        type: String,
        trim: true,
      },
    ],

    // ------------------------------------------------------------
    // Ingredients
    // ------------------------------------------------------------

    ingredients: [
      {
        name: {
          type: String,
          trim: true,
        },

        description: {
          type: String,
          trim: true,
          maxlength: 500,
        },

        quantity: {
          type: String,
          trim: true,
          maxlength: 100,
        },

        form: {
          type: String,
          trim: true,
          maxlength: 100,
        },
      },
    ],

    // ------------------------------------------------------------
    // Safety
    // ------------------------------------------------------------

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

    // ------------------------------------------------------------
    // Personalization
    // ------------------------------------------------------------

    recommendedFor: {
      energyLevels: [
        {
          type: String,
          trim: true,
        },
      ],

      digestion: [
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

    // ------------------------------------------------------------
    // Educational / source information
    // ------------------------------------------------------------

    traditionalUseNote: {
      type: String,
      trim: true,
      maxlength: 1500,
    },

    evidenceNote: {
      type: String,
      trim: true,
      maxlength: 1500,
    },

    sources: [
      {
        title: {
          type: String,
          trim: true,
          maxlength: 300,
        },

        url: {
          type: String,
          trim: true,
        },

        publisher: {
          type: String,
          trim: true,
          maxlength: 200,
        },
      },
    ],

    // ------------------------------------------------------------
    // App metadata
    // ------------------------------------------------------------

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

// ------------------------------------------------------------
// Indexes
// ------------------------------------------------------------

ayurvedaSchema.index({
  type: 1,
  category: 1,
  isActive: 1,
});

ayurvedaSchema.index({
  "recommendedFor.goalCategories": 1,
});

ayurvedaSchema.index({
  "recommendedFor.concerns": 1,
});

ayurvedaSchema.index({
  doshas: 1,
});

ayurvedaSchema.index({
  tags: 1,
});

ayurvedaSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  benefits: "text",
});

const Ayurveda = mongoose.model("Ayurveda", ayurvedaSchema);

export default Ayurveda;
