import mongoose from "mongoose";
import { env } from "./env.js";

let cachedConnection = null;
let connectionPromise = null;

export const connectDB = async () => {
  // Already connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // Connection currently in progress
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
    })
    .then((connection) => {
      cachedConnection = connection;

      console.log(`MongoDB connected: ${connection.connection.host}`);

      return connection;
    })
    .catch((error) => {
      connectionPromise = null;
      cachedConnection = null;

      console.error("MongoDB connection failed:", {
        name: error.name,
        message: error.message,
      });

      throw error;
    });

  return connectionPromise;
};
