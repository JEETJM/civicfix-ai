const mongoose = require("mongoose");
const { ALL_COMPLAINT_CATEGORIES } = require("../constants/complaintCategories");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ALL_COMPLAINT_CATEGORIES,
      required: [true, "Department category is required"],
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    officerName: {
      type: String,
      default: "",
    },

    seniorOfficerName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    area: {
      type: String,
      default: "All Zones",
    },

    activeComplaints: {
      type: Number,
      default: 0,
    },

    resolvedComplaints: {
      type: Number,
      default: 0,
    },

    averageResolutionTime: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;