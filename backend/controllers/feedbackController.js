const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");
const User = require("../models/User");
const { createStatusTimeline } = require("../utils/statusTimeline");
const {
  getTrustScoreAfterFeedback,
  getTrustBadge,
} = require("../utils/trustScoreCalculator");

const createFeedback = async (req, res, next) => {
  try {
    const { complaintId, rating, comment = "" } = req.body;

    if (!complaintId || !rating) {
      res.status(400);
      throw new Error("Complaint ID and rating are required.");
    }

    const complaint = await Complaint.findOne({
      $or: [{ _id: complaintId }, { complaintId }],
    });

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    if (String(complaint.reportedBy) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only give feedback on your own complaint.");
    }

    if (!["Resolved", "Closed"].includes(complaint.status)) {
      res.status(400);
      throw new Error("Feedback can be submitted only after complaint is resolved.");
    }

    const existingFeedback = await Feedback.findOne({
      complaint: complaint._id,
      citizen: req.user._id,
    });

    if (existingFeedback) {
      res.status(400);
      throw new Error("Feedback already submitted for this complaint.");
    }

    const feedback = await Feedback.create({
      complaint: complaint._id,
      complaintId: complaint.complaintId,
      citizen: req.user._id,
      rating: Number(rating),
      comment,
      isSatisfied: Number(rating) >= 3,
    });

    complaint.feedbackGiven = true;
    complaint.citizenRating = Number(rating);
    await complaint.save();

    const user = await User.findById(req.user._id);
    user.trustScore = getTrustScoreAfterFeedback(user.trustScore, Number(rating));
    user.trustBadge = getTrustBadge(user.trustScore);
    await user.save();

    await createStatusTimeline({
      complaint: complaint._id,
      status: complaint.status,
      title: "Citizen Feedback Submitted",
      message: `Citizen submitted feedback with rating ${rating}/5.`,
      updatedBy: req.user._id,
      updatedByRole: req.user.role,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      feedback,
      trustScore: user.trustScore,
      trustBadge: user.trustBadge,
    });
  } catch (error) {
    next(error);
  }
};

const getMyFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ citizen: req.user._id })
      .populate("complaint", "title status urgency department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate("citizen", "name email phone trustScore")
      .populate("complaint", "title status urgency department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getMyFeedbacks,
  getAllFeedbacks,
};