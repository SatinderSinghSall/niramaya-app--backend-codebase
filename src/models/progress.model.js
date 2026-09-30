import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    mood: {
      type: Number,
      min: 1,
      max: 5,
    },

    energyLevel: {
      type: Number,
      min: 1,
      max: 5,
    },

    stressLevel: {
      type: Number,
      min: 1,
      max: 5,
    },

    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },

    sleepQuality: {
      type: Number,
      min: 1,
      max: 5,
    },

    waterIntakeLiters: {
      type: Number,
      min: 0,
      max: 20,
    },

    steps: {
      type: Number,
      min: 0,
      max: 200000,
    },

    exerciseMinutes: {
      type: Number,
      min: 0,
      max: 1440,
    },

    yogaMinutes: {
      type: Number,
      min: 0,
      max: 1440,
    },

    meditationMinutes: {
      type: Number,
      min: 0,
      max: 1440,
    },

    weightKg: {
      type: Number,
      min: 1,
      max: 500,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    completedActivities: [
      {
        type: String,
        trim: true,
        maxlength: 100,
      },
    ],
  },
  {
    timestamps: true,
  },
);

progressSchema.index({
  user: 1,
  date: -1,
});

progressSchema.index({
  user: 1,
  createdAt: -1,
});

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
