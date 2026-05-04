const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  try {
    if (!env.MONGO_URI || env.MONGO_URI === "your_mongodb_atlas_connection_string") {
      console.log("⚠️ MongoDB URI not set. Add MONGO_URI in backend/.env");
      return;
    }

    const conn = await mongoose.connect(env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;