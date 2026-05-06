const User = require("../models/User");
const OTP = require("../models/OTP");
const Complaint = require("../models/Complaint");
const StatusTimeline = require("../models/StatusTimeline");
const generateOTP = require("../utils/generateOTP");
const sendOTPEmail = require("../utils/sendOTP");

const sendEmailInBackground = async ({
  otpRecordId,
  email,
  otp,
  purpose,
  complaintId,
}) => {
  try {
    await sendOTPEmail({
      to: email,
      otp,
      purpose,
      complaintId,
    });

    await OTP.findByIdAndUpdate(otpRecordId, {
      emailSent: true,
      emailError: "",
    });

    console.log(`✅ OTP email sent successfully to ${email}`);
  } catch (error) {
    await OTP.findByIdAndUpdate(otpRecordId, {
      emailSent: false,
      emailError: error.message || "Email sending failed.",
    });

    console.error("❌ OTP email sending failed:", error.message);
  }
};

const createOTPRecord = async ({
  email,
  phone = "",
  purpose,
  complaintId = "",
}) => {
  const cleanEmail = email.toLowerCase().trim();
  const cleanComplaintId = complaintId ? complaintId.trim() : "";
  const otp = generateOTP();

  await OTP.deleteMany({
    email: cleanEmail,
    purpose,
    complaintId: cleanComplaintId,
    isUsed: false,
  });

  const otpRecord = await OTP.create({
    email: cleanEmail,
    phone,
    otp,
    purpose,
    complaintId: cleanComplaintId,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    emailSent: false,
    emailError: "Email sending started...",
  });

  // ✅ Main Render fix: response wait korbe na, email background-e jabe
  setImmediate(() => {
    sendEmailInBackground({
      otpRecordId: otpRecord._id,
      email: cleanEmail,
      otp,
      purpose,
      complaintId: cleanComplaintId,
    });
  });

  return otpRecord;
};

const verifyOTPRecord = async ({ email, otp, purpose, complaintId = "" }) => {
  const cleanEmail = email.toLowerCase().trim();
  const cleanComplaintId = complaintId ? complaintId.trim() : "";

  const record = await OTP.findOne({
    email: cleanEmail,
    otp,
    purpose,
    complaintId: cleanComplaintId,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    return null;
  }

  record.isUsed = true;
  await record.save();

  return record;
};

// POST /api/otp/forgot-password
const sendForgotPasswordOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email is required.");
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      res.status(404);
      throw new Error("No account found with this email.");
    }

    const otpRecord = await createOTPRecord({
      email: user.email,
      purpose: "FORGOT_PASSWORD",
    });

    return res.status(200).json({
      success: true,
      message: "OTP generated. Please check your Gmail inbox or spam folder.",
      emailQueued: true,
      otpId: otpRecord._id,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/otp/reset-password
const resetPasswordWithOTP = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400);
      throw new Error("Email, OTP and new password are required.");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters.");
    }

    const record = await verifyOTPRecord({
      email,
      otp,
      purpose: "FORGOT_PASSWORD",
    });

    if (!record) {
      res.status(400);
      throw new Error("Invalid or expired OTP.");
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can login now.",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/otp/track-complaint/send
const sendComplaintTrackingOTP = async (req, res, next) => {
  try {
    const { complaintId, email } = req.body;

    if (!complaintId || !email) {
      res.status(400);
      throw new Error("Complaint ID and email are required.");
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanComplaintId = complaintId.trim();

    const complaint = await Complaint.findOne({
      complaintId: cleanComplaintId,
    }).populate("reportedBy", "name email phone");

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    if (complaint.reportedBy?.email !== cleanEmail) {
      res.status(403);
      throw new Error("This email is not linked with this complaint.");
    }

    const otpRecord = await createOTPRecord({
      email: cleanEmail,
      purpose: "COMPLAINT_TRACKING",
      complaintId: complaint.complaintId,
    });

    return res.status(200).json({
      success: true,
      message:
        "Tracking OTP generated. Please check your Gmail inbox or spam folder.",
      emailQueued: true,
      otpId: otpRecord._id,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/otp/track-complaint/verify
const verifyComplaintTrackingOTP = async (req, res, next) => {
  try {
    const { complaintId, email, otp } = req.body;

    if (!complaintId || !email || !otp) {
      res.status(400);
      throw new Error("Complaint ID, email and OTP are required.");
    }

    const cleanComplaintId = complaintId.trim();

    const record = await verifyOTPRecord({
      email,
      otp,
      purpose: "COMPLAINT_TRACKING",
      complaintId: cleanComplaintId,
    });

    if (!record) {
      res.status(400);
      throw new Error("Invalid or expired OTP.");
    }

    const complaint = await Complaint.findOne({
      complaintId: cleanComplaintId,
    })
      .populate("reportedBy", "name email phone")
      .populate("assignedDepartmentId", "name officerName email phone");

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    const timeline = await StatusTimeline.find({
      complaint: complaint._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Complaint tracking verified.",
      complaint,
      timeline,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendForgotPasswordOTP,
  resetPasswordWithOTP,
  sendComplaintTrackingOTP,
  verifyComplaintTrackingOTP,
};