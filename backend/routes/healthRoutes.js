const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CivicFix AI API is running successfully",
    project: "CivicFix AI",
    status: "healthy",
  });
});

module.exports = router;