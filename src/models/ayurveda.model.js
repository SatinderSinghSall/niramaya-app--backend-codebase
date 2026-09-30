import mongoose from "mongoose";

const ayurvedaSchema = new mongoose.Schema(
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
      },
    ],

    usage: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

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

ayurvedaSchema.index({
  type: 1,
  category: 1,
  isActive: 1,
});

ayurvedaSchema.index({
  "recommendedFor.goalCategories": 1,
});

ayurvedaSchema.index({
  tags: 1,
});

const Ayurveda = mongoose.model("Ayurveda", ayurvedaSchema);

export default Ayurveda;
