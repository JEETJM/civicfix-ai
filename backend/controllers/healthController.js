const mongoose = require("mongoose");

const getHealth = async (req, res) => {
  const mongoState = mongoose.connection.readyState;

  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return res.status(200).json({
    success: true,
    message: "CivicFix AI API is healthy",
    service: "CivicFix AI",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    database: states[mongoState] || "unknown",
  });
};

module.exports = {
  getHealth,
};