const getHoursDifference = (date) => {
  const oldTime = new Date(date).getTime();
  const now = Date.now();
  return Math.floor((now - oldTime) / (1000 * 60 * 60));
};

const shouldEscalateComplaint = (complaint) => {
  const notResolvedStatuses = [
    "Submitted",
    "AI Analyzed",
    "Duplicate Checked",
    "Assigned to Department",
    "In Progress",
  ];

  if (!notResolvedStatuses.includes(complaint.status)) {
    return false;
  }

  const hoursOld = getHoursDifference(complaint.createdAt);

  if (complaint.urgency === "Critical" && hoursOld >= 24) return true;
  if (complaint.urgency === "High" && hoursOld >= 48) return true;
  if (hoursOld >= 72) return true;

  return false;
};

const getEscalationReason = (complaint) => {
  const hoursOld = getHoursDifference(complaint.createdAt);

  return `Complaint is unresolved for ${hoursOld} hours. Urgency: ${complaint.urgency}. Current status: ${complaint.status}.`;
};

module.exports = {
  shouldEscalateComplaint,
  getEscalationReason,
};