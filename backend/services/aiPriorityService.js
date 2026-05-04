const PriorityScore = require("../models/PriorityScore");
const { analyzeComplaintText } = require("../utils/aiScoring");

const analyzeAndSavePriority = async ({
  complaint = null,
  complaintId = "",
  title,
  description,
  selectedCategory = "",
}) => {
  const analysis = analyzeComplaintText({
    title,
    description,
    selectedCategory,
  });

  const priorityScore = await PriorityScore.create({
    complaint: complaint ? complaint._id : null,
    complaintId: complaintId || (complaint ? complaint.complaintId : ""),
    category: analysis.category,
    score: analysis.aiScore,
    urgencyLevel: analysis.urgency,
    detectedKeywords: analysis.detectedKeywords,
    riskFactors: analysis.riskFactors,
    department: analysis.department,
    aiReason: analysis.aiReason,
    analysisSource: "rule_based_ai",
  });

  return {
    analysis,
    priorityScore,
  };
};

const analyzeOnly = ({ title, description, selectedCategory = "" }) => {
  return analyzeComplaintText({
    title,
    description,
    selectedCategory,
  });
};

module.exports = {
  analyzeAndSavePriority,
  analyzeOnly,
};