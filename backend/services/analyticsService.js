const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Department = require("../models/Department");
const DuplicateReport = require("../models/DuplicateReport");
const PriorityScore = require("../models/PriorityScore");

const getSummaryStats = async () => {
  const [
    totalComplaints,
    totalUsers,
    totalDepartments,
    totalDuplicates,
    totalHighPriority,
    pendingComplaints,
    inProgressComplaints,
    resolvedComplaints,
    escalatedComplaints,
  ] = await Promise.all([
    Complaint.countDocuments(),
    User.countDocuments(),
    Department.countDocuments(),
    DuplicateReport.countDocuments(),
    Complaint.countDocuments({ urgency: { $in: ["High", "Critical"] } }),
    Complaint.countDocuments({ status: { $in: ["Submitted", "AI Analyzed", "Duplicate Checked", "Assigned to Department"] } }),
    Complaint.countDocuments({ status: "In Progress" }),
    Complaint.countDocuments({ status: { $in: ["Resolved", "Citizen Verified", "Closed"] } }),
    Complaint.countDocuments({ status: "Escalated" }),
  ]);

  const resolutionRate =
    totalComplaints === 0
      ? 0
      : Math.round((resolvedComplaints / totalComplaints) * 100);

  return {
    totalComplaints,
    totalUsers,
    totalDepartments,
    totalDuplicates,
    totalHighPriority,
    pendingComplaints,
    inProgressComplaints,
    resolvedComplaints,
    escalatedComplaints,
    resolutionRate,
  };
};

const groupCountByField = async (fieldName) => {
  return Complaint.aggregate([
    {
      $group: {
        _id: `$${fieldName}`,
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);
};

const getCategoryWiseStats = async () => {
  return groupCountByField("category");
};

const getStatusWiseStats = async () => {
  return groupCountByField("status");
};

const getUrgencyWiseStats = async () => {
  return groupCountByField("urgency");
};

const getDepartmentWiseStats = async () => {
  return groupCountByField("department");
};

const getAreaWiseStats = async () => {
  return Complaint.aggregate([
    {
      $group: {
        _id: {
          city: "$location.city",
          state: "$location.state",
        },
        count: { $sum: 1 },
        highPriority: {
          $sum: {
            $cond: [{ $in: ["$urgency", ["High", "Critical"]] }, 1, 0],
          },
        },
        resolved: {
          $sum: {
            $cond: [{ $in: ["$status", ["Resolved", "Citizen Verified", "Closed"]] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);
};

const getRecentComplaints = async (limit = 10) => {
  return Complaint.find({})
    .populate("reportedBy", "name email phone")
    .populate("assignedDepartmentId", "name category officerName")
    .sort({ createdAt: -1 })
    .limit(Number(limit));
};

const getPriorityScoreStats = async () => {
  const result = await PriorityScore.aggregate([
    {
      $group: {
        _id: "$urgencyLevel",
        count: { $sum: 1 },
        averageScore: { $avg: "$score" },
      },
    },
    {
      $sort: {
        averageScore: -1,
      },
    },
  ]);

  return result.map((item) => ({
    _id: item._id,
    count: item.count,
    averageScore: Math.round(item.averageScore),
  }));
};

module.exports = {
  getSummaryStats,
  getCategoryWiseStats,
  getStatusWiseStats,
  getUrgencyWiseStats,
  getDepartmentWiseStats,
  getAreaWiseStats,
  getRecentComplaints,
  getPriorityScoreStats,
};