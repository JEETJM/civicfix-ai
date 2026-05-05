const mongoose = require("mongoose");

const escalationLogSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    complaintId: {
      type: String,
      required: true,
    },

    oldLevel: {
      type: String,
      default: "Department Officer",
    },

    newLevel: {
      type: String,
      default: "Admin",
    },

    reason: {
      type: String,
      required: true,
    },

    escalatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    escalationType: {
      type: String,
      enum: ["Auto", "Manual"],
      default: "Auto",
    },

    status: {
      type: String,
      enum: ["Open", "Reviewed", "Resolved"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

const EscalationLog = mongoose.model("EscalationLog", escalationLogSchema);

module.exports = EscalationLog;