const mongoose = require("mongoose");

const duplicateReportSchema = new mongoose.Schema(
  {
    originalComplaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    duplicateComplaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    originalComplaintId: {
      type: String,
      required: true,
    },

    duplicateComplaintId: {
      type: String,
      required: true,
    },

    similarityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    distanceInMeters: {
      type: Number,
      default: 0,
    },

    matchedCategory: {
      type: String,
      required: true,
    },

    matchedKeywords: {
      type: [String],
      default: [],
    },

    mergedStatus: {
      type: String,
      enum: ["Pending", "Merged", "Rejected"],
      default: "Merged",
    },

    detectionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const DuplicateReport = mongoose.model("DuplicateReport", duplicateReportSchema);

module.exports = DuplicateReport;