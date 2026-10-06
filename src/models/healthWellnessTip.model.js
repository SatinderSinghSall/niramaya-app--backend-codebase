import mongoose from "mongoose";

const referenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    source: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    url: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    publishedDate: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const healthWellnessTipSchema = new mongoose.Schema(
  {
    // ============================================================
    // BASIC CONTENT
    // ============================================================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },

    highlights: {
      type: [String],
      default: [],
      validate: {
        validator: (items) =>
          Array.isArray(items) &&
          items.length <= 8 &&
          items.every(
            (item) =>
              typeof item === "string" &&
              item.trim().length > 0 &&
              item.trim().length <= 250,
          ),
        message:
          "Highlights must contain up to 8 non-empty strings of maximum 250 characters.",
      },
    },

    // ============================================================
    // CLASSIFICATION
    // ============================================================

    category: {
      type: String,
      enum: [
        "nutrition",
        "fitness",
        "yoga",
        "ayurveda",
        "mental-wellbeing",
        "sleep",
        "stress-management",
        "lifestyle",
        "preventive-care",
        "personal-care",
        "healthy-habits",
        "general-wellness",
      ],
      default: "general-wellness",
      index: true,
    },

    type: {
      type: String,
      enum: [
        "tip",
        "guide",
        "lesson",
        "routine",
        "exercise",
        "practice",
        "warning",
        "educational",
      ],
      default: "tip",
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (items) =>
          Array.isArray(items) &&
          items.length <= 15 &&
          items.every(
            (item) =>
              typeof item === "string" &&
              item.trim().length > 0 &&
              item.trim().length <= 40,
          ),
        message:
          "Tags must contain up to 15 non-empty strings of maximum 40 characters.",
      },
    },

    // ============================================================
    // IMAGE / MEDIA
    // ============================================================

    image: {
      enabled: {
        type: Boolean,
        default: false,
      },

      url: {
        type: String,
        trim: true,
        maxlength: 1000,
      },

      altText: {
        type: String,
        trim: true,
        maxlength: 200,
      },

      caption: {
        type: String,
        trim: true,
        maxlength: 300,
      },

      credit: {
        type: String,
        trim: true,
        maxlength: 200,
      },
    },

    thumbnailUrl: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // ============================================================
    // SOURCE
    // ============================================================

    source: {
      name: {
        type: String,
        trim: true,
        maxlength: 200,
      },

      url: {
        type: String,
        trim: true,
        maxlength: 1000,
      },

      accessedAt: {
        type: Date,
        default: null,
      },
    },

    // ============================================================
    // REFERENCES
    // ============================================================

    references: {
      type: [referenceSchema],
      default: [],
      validate: {
        validator: (items) => Array.isArray(items) && items.length <= 15,
        message: "A maximum of 15 references is allowed.",
      },
    },

    // ============================================================
    // SAFETY / REVIEW
    // ============================================================

    disclaimer: {
      type: String,
      trim: true,
      maxlength: 1000,
      default:
        "This content is for general wellness and educational purposes only and is not a substitute for professional medical advice.",
    },

    safetyNote: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    reviewed: {
      type: Boolean,
      default: false,
    },

    reviewedBy: {
      name: {
        type: String,
        trim: true,
        maxlength: 150,
      },

      qualification: {
        type: String,
        trim: true,
        maxlength: 150,
      },

      reviewedAt: {
        type: Date,
        default: null,
      },
    },

    // ============================================================
    // READING EXPERIENCE
    // ============================================================

    readTimeMinutes: {
      type: Number,
      min: 1,
      max: 120,
      default: 3,
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    // ============================================================
    // PUBLISHING
    // ============================================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    priority: {
      type: Number,
      min: 0,
      max: 9999,
      default: 0,
    },

    startDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    endDate: {
      type: Date,
      default: null,
      index: true,
    },

    // ============================================================
    // OPTIONAL APP ACTION
    // ============================================================

    action: {
      enabled: {
        type: Boolean,
        default: false,
      },

      label: {
        type: String,
        trim: true,
        maxlength: 50,
      },

      route: {
        type: String,
        trim: true,
        maxlength: 200,
      },
    },
  },
  {
    timestamps: true,
  },
);

// ================================================================
// INDEXES
// ================================================================

healthWellnessTipSchema.index({
  isActive: 1,
  featured: 1,
  category: 1,
  startDate: 1,
  endDate: 1,
});

healthWellnessTipSchema.index({
  isActive: 1,
  priority: -1,
  startDate: -1,
});

healthWellnessTipSchema.index({
  category: 1,
  type: 1,
  isActive: 1,
});

healthWellnessTipSchema.index({
  tags: 1,
});

// ================================================================
// VALIDATION
// ================================================================

healthWellnessTipSchema.pre("validate", function () {
  // ------------------------------------------------------------
  // DATE VALIDATION
  // ------------------------------------------------------------

  if (this.endDate && this.startDate && this.endDate <= this.startDate) {
    throw new Error("End date must be later than start date.");
  }

  // ------------------------------------------------------------
  // IMAGE VALIDATION
  // ------------------------------------------------------------

  if (this.image?.enabled && !this.image?.url) {
    throw new Error("Image URL is required when image is enabled.");
  }

  // ------------------------------------------------------------
  // ACTION VALIDATION
  // ------------------------------------------------------------

  if (this.action?.enabled) {
    if (!this.action?.label || !this.action?.route) {
      throw new Error(
        "Action label and route are required when action is enabled.",
      );
    }
  }

  // ------------------------------------------------------------
  // REVIEW VALIDATION
  // ------------------------------------------------------------

  if (this.reviewed && !this.reviewedBy?.name) {
    throw new Error(
      "Reviewer name is required when content is marked as reviewed.",
    );
  }

  // ------------------------------------------------------------
  // SOURCE URL VALIDATION
  // ------------------------------------------------------------

  if (this.source?.url) {
    try {
      const url = new URL(this.source.url);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error("Source URL must be a valid HTTP or HTTPS URL.");
    }
  }

  // ------------------------------------------------------------
  // IMAGE URL VALIDATION
  // ------------------------------------------------------------

  if (this.image?.url) {
    try {
      const url = new URL(this.image.url);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error("Image URL must be a valid HTTP or HTTPS URL.");
    }
  }

  // ------------------------------------------------------------
  // THUMBNAIL URL VALIDATION
  // ------------------------------------------------------------

  if (this.thumbnailUrl) {
    try {
      const url = new URL(this.thumbnailUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error("Thumbnail URL must be a valid HTTP or HTTPS URL.");
    }
  }
});

// ================================================================
// MODEL
// ================================================================

const HealthWellnessTip = mongoose.model(
  "HealthWellnessTip",
  healthWellnessTipSchema,
);

export default HealthWellnessTip;
