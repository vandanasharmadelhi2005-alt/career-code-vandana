import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL || process.env.DATABASE_URL;

  if (!mongoUri) {
    throw new Error("MongoDB connection string is missing. Add MONGO_URI, MONGO_URL, or DATABASE_URL.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};
