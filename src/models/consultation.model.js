import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    consultationType: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    preferredDate: {
      type: Date,
      required: true,
      index: true,
    },

    preferredTime: {
      type: String,
      required: true,
      trim: true,
    },

    concern: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    goals: [
      {
        type: String,
        trim: true,
        maxlength: 200,
      },
    ],

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["requested", "confirmed", "rescheduled", "completed", "cancelled"],
      default: "requested",
      index: true,
    },

    consultant: {
      name: {
        type: String,
        trim: true,
        maxlength: 150,
      },

      specialization: {
        type: String,
        trim: true,
        maxlength: 200,
      },

      contact: {
        type: String,
        trim: true,
        maxlength: 200,
      },
    },

    scheduledAt: {
      type: Date,
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

consultationSchema.index({
  user: 1,
  status: 1,
});

consultationSchema.index({
  user: 1,
  preferredDate: -1,
});

consultationSchema.index({
  user: 1,
  createdAt: -1,
});

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;
