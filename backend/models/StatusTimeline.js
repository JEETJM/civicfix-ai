const mongoose = require("mongoose");

const statusTimelineSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedByRole: {
      type: String,
      default: "system",
    },
  },
  {
    timestamps: true,
  }
);

const StatusTimeline = mongoose.model("StatusTimeline", statusTimelineSchema);

module.exports = StatusTimeline;