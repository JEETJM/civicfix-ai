const User = require("../models/User");
const OTP = require("../models/OTP");
const Complaint = require("../models/Complaint");
const StatusTimeline = require("../models/StatusTimeline");
const generateOTP = require("../utils/generateOTP");
const sendOTPEmail = require("../utils/sendOTP");

const createOTPRecord = async ({
  email,
  phone = "",
  purpose,
  complaintId = "",
}) => {
  const otp = generateOTP();

  await OTP.deleteMany({
    email,
    purpose,
    complaintId,
    isUsed: false,
  });

  const otpRecord = await OTP.create({
    email,
    phone,
    otp,
    purpose,
    complaintId,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOTPEmail({
    to: email,
    otp,
    purpose,
    complaintId,
  });

  return otpRecord;
};

const verifyOTPRecord = async ({ email, otp, purpose, complaintId = "" }) => {
  const record = await OTP.findOne({
    email,
    otp,
    purpose,
    complaintId,
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

const sendForgotPasswordOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email is required.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("No account found with this email.");
    }

    await createOTPRecord({
      email: user.email,
      purpose: "FORGOT_PASSWORD",
    });

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

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

    const user = await User.findOne({ email }).select("+password");

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

const sendComplaintTrackingOTP = async (req, res, next) => {
  try {
    const { complaintId, email } = req.body;

    if (!complaintId || !email) {
      res.status(400);
      throw new Error("Complaint ID and email are required.");
    }

    const complaint = await Complaint.findOne({ complaintId }).populate(
      "reportedBy",
      "name email phone"
    );

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    if (complaint.reportedBy?.email !== email) {
      res.status(403);
      throw new Error("This email is not linked with this complaint.");
    }

    await createOTPRecord({
      email,
      purpose: "COMPLAINT_TRACKING",
      complaintId,
    });

    return res.status(200).json({
      success: true,
      message: "Tracking OTP sent to your registered email.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyComplaintTrackingOTP = async (req, res, next) => {
  try {
    const { complaintId, email, otp } = req.body;

    if (!complaintId || !email || !otp) {
      res.status(400);
      throw new Error("Complaint ID, email and OTP are required.");
    }

    const record = await verifyOTPRecord({
      email,
      otp,
      purpose: "COMPLAINT_TRACKING",
      complaintId,
    });

    if (!record) {
      res.status(400);
      throw new Error("Invalid or expired OTP.");
    }

    const complaint = await Complaint.findOne({ complaintId })
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