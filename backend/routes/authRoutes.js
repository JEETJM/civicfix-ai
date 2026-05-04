const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  updateMyProfile,
  changePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth route is working",
  });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;