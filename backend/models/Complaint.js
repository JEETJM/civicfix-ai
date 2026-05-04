const mongoose = require("mongoose");
const { ALL_COMPLAINT_CATEGORIES } = require("../constants/complaintCategories");
const { ALL_COMPLAINT_STATUS, COMPLAINT_STATUS } = require("../constants/complaintStatus");
const { ALL_URGENCY_LEVELS, URGENCY_LEVELS } = require("../constants/urgencyLevels");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    description: {
      type: String,
      required: [true, "Complaint description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [1500, "Description cannot exceed 1500 characters"],
    },

    category: {
      type: String,
      enum: ALL_COMPLAINT_CATEGORIES,
      default: "other",
    },

    urgency: {
      type: String,
      enum: ALL_URGENCY_LEVELS,
      default: URGENCY_LEVELS.MEDIUM,
    },

    aiScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    aiReason: {
      type: String,
      default: "AI analysis will be added in upcoming phase.",
    },

    department: {
      type: String,
      default: "General Civic Department",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    beforeImage: {
      type: String,
      default: "",
    },

    afterImage: {
      type: String,
      default: "",
    },

    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
      city: {
        type: String,
        default: "",
        trim: true,
      },
      state: {
        type: String,
        default: "",
        trim: true,
      },
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },

    status: {
      type: String,
      enum: ALL_COMPLAINT_STATUS,
      default: COMPLAINT_STATUS.SUBMITTED,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },

    mergedReportsCount: {
      type: Number,
      default: 0,
    },

    trustWeight: {
      type: Number,
      default: 1,
    },

    escalationLevel: {
      type: Number,
      default: 0,
    },

    escalationDeadline: {
      type: Date,
      default: null,
    },

    adminRemark: {
      type: String,
      default: "",
    },

    departmentRemark: {
      type: String,
      default: "",
    },

    resolutionNote: {
      type: String,
      default: "",
    },

    citizenFeedbackGiven: {
      type: Boolean,
      default: false,
    },

    citizenVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;