const PriorityScore = require("../models/PriorityScore");
const { analyzeOnly } = require("../services/aiPriorityService");

const analyzeComplaintPriority = async (req, res, next) => {
  try {
    const { title, description, category = "" } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error("Title and description are required for AI analysis.");
    }

    const analysis = analyzeOnly({
      title,
      description,
      selectedCategory: category,
    });

    return res.status(200).json({
      success: true,
      message: "AI priority analysis completed.",
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

const getPriorityByComplaint = async (req, res, next) => {
  try {
    const priority = await PriorityScore.findOne({
      complaint: req.params.complaintId,
    }).populate("complaint", "complaintId title status");

    if (!priority) {
      res.status(404);
      throw new Error("Priority score not found for this complaint.");
    }

    return res.status(200).json({
      success: true,
      priority,
    });
  } catch (error) {
    next(error);
  }
};

const getHighPriorityComplaints = async (req, res, next) => {
  try {
    const priorities = await PriorityScore.find({
      score: { $gte: 70 },
    })
      .populate("complaint", "complaintId title status location department")
      .sort({ score: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: priorities.length,
      priorities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeComplaintPriority,
  getPriorityByComplaint,
  getHighPriorityComplaints,
};