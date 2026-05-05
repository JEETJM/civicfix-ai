const mongoose = require("mongoose");

const resolutionProofSchema = new mongoose.Schema(
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

    department: {
      type: String,
      default: "",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    beforeImageUrl: {
      type: String,
      default: "",
    },

    afterImageUrl: {
      type: String,
      default: "",
    },

    workRemark: {
      type: String,
      default: "",
    },

    proofStatus: {
      type: String,
      enum: ["Pending", "Before Uploaded", "After Uploaded", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const ResolutionProof = mongoose.model(
  "ResolutionProof",
  resolutionProofSchema
);

module.exports = ResolutionProof;