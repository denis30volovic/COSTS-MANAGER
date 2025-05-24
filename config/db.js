/**
 * @fileoverview Database connection configuration
 * @requires mongoose
 * @requires dotenv
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Connects to MongoDB using the connection string from environment variables
 * @returns {Promise<void>}
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;