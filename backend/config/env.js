const dotenv = require("dotenv");

dotenv.config();

const env = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

module.exports = env;