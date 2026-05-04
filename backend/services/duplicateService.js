const DuplicateReport = require("../models/DuplicateReport");
const { checkDuplicateComplaint } = require("../utils/duplicateChecker");
const { createStatusTimeline } = require("../utils/statusTimeline");
const { COMPLAINT_STATUS } = require("../constants/complaintStatus");

const detectAndSaveDuplicate = async ({ complaint }) => {
  const duplicateResult = await checkDuplicateComplaint({
    title: complaint.title,
    description: complaint.description,
    category: complaint.category,
    location: complaint.location,
    currentComplaintId: complaint._id,
  });

  if (!duplicateResult.isDuplicate) {
    return {
      isDuplicate: false,
      duplicateReport: null,
      duplicateResult,
    };
  }

  const originalComplaint = duplicateResult.originalComplaint;

  complaint.duplicateOf = originalComplaint._id;
  complaint.status = COMPLAINT_STATUS.DUPLICATE_CHECKED;
  complaint.adminRemark = `Possible duplicate of complaint ${originalComplaint.complaintId}`;
  await complaint.save();

  originalComplaint.mergedReportsCount += 1;
  originalComplaint.trustWeight += 0.25;

  if (originalComplaint.aiScore < 95) {
    originalComplaint.aiScore = Math.min(originalComplaint.aiScore + 5, 100);
  }

  await originalComplaint.save();

  const duplicateReport = await DuplicateReport.create({
    originalComplaint: originalComplaint._id,
    duplicateComplaint: complaint._id,
    originalComplaintId: originalComplaint.complaintId,
    duplicateComplaintId: complaint.complaintId,
    similarityScore: duplicateResult.similarityScore,
    distanceInMeters: duplicateResult.distanceInMeters || 0,
    matchedCategory: complaint.category,
    matchedKeywords: duplicateResult.matchedKeywords,
    mergedStatus: "Merged",
    detectionReason: duplicateResult.reason,
  });

  await createStatusTimeline({
    complaint: complaint._id,
    status: COMPLAINT_STATUS.DUPLICATE_CHECKED,
    title: "Duplicate Complaint Detected",
    message: `This complaint appears similar to ${originalComplaint.complaintId}. It has been linked to increase priority weight.`,
    updatedBy: complaint.reportedBy,
    updatedByRole: "system",
  });

  await createStatusTimeline({
    complaint: originalComplaint._id,
    status: COMPLAINT_STATUS.DUPLICATE_CHECKED,
    title: "Duplicate Report Merged",
    message: `A similar complaint ${complaint.complaintId} was merged with this complaint. Priority weight increased.`,
    updatedBy: complaint.reportedBy,
    updatedByRole: "system",
  });

  return {
    isDuplicate: true,
    duplicateReport,
    duplicateResult,
  };
};

const checkDuplicateOnly = async ({ title, description, category, location }) => {
  return checkDuplicateComplaint({
    title,
    description,
    category,
    location,
  });
};

module.exports = {
  detectAndSaveDuplicate,
  checkDuplicateOnly,
};