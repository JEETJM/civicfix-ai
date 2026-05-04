const mongoose = require("mongoose");
const { ALL_COMPLAINT_CATEGORIES } = require("../constants/complaintCategories");

const routingRuleSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ALL_COMPLAINT_CATEGORIES,
      required: true,
      unique: true,
    },

    departmentName: {
      type: String,
      required: true,
    },

    priorityLevel: {
      type: String,
      default: "Medium",
    },

    assignedOfficer: {
      type: String,
      default: "",
    },

    escalationOfficer: {
      type: String,
      default: "",
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

const RoutingRule = mongoose.model("RoutingRule", routingRuleSchema);

module.exports = RoutingRule;