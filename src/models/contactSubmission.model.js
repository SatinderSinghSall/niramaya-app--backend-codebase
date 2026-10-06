import mongoose from "mongoose";

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
      index: true,
    },

    adminNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },

    readAt: {
      type: Date,
      default: null,
    },

    repliedAt: {
      type: Date,
      default: null,
    },

    archivedAt: {
      type: Date,
      default: null,
    },

    source: {
      type: String,
      default: "website",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "contactsubmissions",
  },
);

contactSubmissionSchema.index({ createdAt: -1 });
contactSubmissionSchema.index({ email: 1 });
contactSubmissionSchema.index({ status: 1, createdAt: -1 });

const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", contactSubmissionSchema);

export default ContactSubmission;
