const express = require("express");
const { analyzeComplaint } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI routes working",
  });
});

router.post("/analyze-complaint", protect, analyzeComplaint);

module.exports = router;