const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Upload routes working",
  });
});

router.post("/image", protect, upload.single("image"), uploadImage);

module.exports = router;