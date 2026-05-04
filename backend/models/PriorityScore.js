const mongoose = require("mongoose");
const { ALL_URGENCY_LEVELS } = require("../constants/urgencyLevels");
const { ALL_COMPLAINT_CATEGORIES } = require("../constants/complaintCategories");

const priorityScoreSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },

    complaintId: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ALL_COMPLAINT_CATEGORIES,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    urgencyLevel: {
      type: String,
      enum: ALL_URGENCY_LEVELS,
      required: true,
    },

    detectedKeywords: {
      type: [String],
      default: [],
    },

    riskFactors: {
      type: [String],
      default: [],
    },

    department: {
      type: String,
      default: "General Civic Department",
    },

    aiReason: {
      type: String,
      required: true,
    },

    analysisSource: {
      type: String,
      default: "rule_based_ai",
    },
  },
  {
    timestamps: true,
  }
);

const PriorityScore = mongoose.model("PriorityScore", priorityScoreSchema);

module.exports = PriorityScore;