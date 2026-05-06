const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["FORGOT_PASSWORD", "COMPLAINT_TRACKING"],
      required: true,
    },

    complaintId: {
      type: String,
      default: "",
      trim: true,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    // ✅ Email status tracking for Render/Brevo debugging
    emailSent: {
      type: Boolean,
      default: false,
    },

    emailError: {
      type: String,
      default: "",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto delete expired OTP documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Helpful query index
otpSchema.index({
  email: 1,
  otp: 1,
  purpose: 1,
  complaintId: 1,
  isUsed: 1,
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;