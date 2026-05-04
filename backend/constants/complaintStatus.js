const COMPLAINT_STATUS = {
  SUBMITTED: "Submitted",
  AI_ANALYZED: "AI Analyzed",
  DUPLICATE_CHECKED: "Duplicate Checked",
  ASSIGNED: "Assigned to Department",
  ACCEPTED: "Accepted by Officer",
  IN_PROGRESS: "In Progress",
  ESCALATED: "Escalated",
  RESOLVED: "Resolved",
  CITIZEN_VERIFIED: "Citizen Verified",
  CLOSED: "Closed",
  REJECTED: "Rejected",
};

const ALL_COMPLAINT_STATUS = Object.values(COMPLAINT_STATUS);

module.exports = {
  COMPLAINT_STATUS,
  ALL_COMPLAINT_STATUS,
};