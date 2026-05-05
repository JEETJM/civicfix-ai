const express = require("express");

const {
  sendForgotPasswordOTP,
  resetPasswordWithOTP,
  sendComplaintTrackingOTP,
  verifyComplaintTrackingOTP,
} = require("../controllers/otpController");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "OTP routes working",
  });
});

router.post("/forgot-password", sendForgotPasswordOTP);
router.post("/reset-password", resetPasswordWithOTP);

router.post("/track-complaint/send", sendComplaintTrackingOTP);
router.post("/track-complaint/verify", verifyComplaintTrackingOTP);

module.exports = router;