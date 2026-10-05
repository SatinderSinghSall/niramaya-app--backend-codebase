import mongoose from "mongoose";

const apiLogSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 10,
    },

    route: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    statusCode: {
      type: Number,
      required: true,
      min: 100,
      max: 599,
    },

    responseTimeMs: {
      type: Number,
      required: true,
      min: 0,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
      index: true,
    },

    ipAddress: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    userAgent: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    errorCode: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    errorMessage: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

apiLogSchema.index({
  createdAt: -1,
});

apiLogSchema.index({
  statusCode: 1,
  createdAt: -1,
});

apiLogSchema.index({
  method: 1,
  createdAt: -1,
});

apiLogSchema.index({
  admin: 1,
  createdAt: -1,
});

const ApiLog = mongoose.model("ApiLog", apiLogSchema);

export default ApiLog;
