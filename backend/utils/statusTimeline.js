const StatusTimeline = require("../models/StatusTimeline");

const createStatusTimeline = async ({
  complaint,
  status,
  title,
  message,
  updatedBy,
  updatedByRole = "system",
}) => {
  return StatusTimeline.create({
    complaint,
    status,
    title,
    message,
    updatedBy,
    updatedByRole,
  });
};

module.exports = {
  createStatusTimeline,
};