const DuplicateReport = require("../models/DuplicateReport");
const Complaint = require("../models/Complaint");
const { checkDuplicateOnly } = require("../services/duplicateService");

const checkDuplicate = async (req, res, next) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      res.status(400);
      throw new Error("Title, description, category and location are required.");
    }

    const duplicateResult = await checkDuplicateOnly({
      title,
      description,
      category,
      location,
    });

    return res.status(200).json({
      success: true,
      message: duplicateResult.isDuplicate
        ? "Possible duplicate complaint found."
        : "No duplicate complaint found.",
      duplicateResult,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDuplicateReports = async (req, res, next) => {
  try {
    const duplicateReports = await DuplicateReport.find({})
      .populate("originalComplaint", "complaintId title status category location aiScore")
      .populate("duplicateComplaint", "complaintId title status category location aiScore")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: duplicateReports.length,
      duplicateReports,
    });
  } catch (error) {
    next(error);
  }
};

const getDuplicateReportByComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findOne({
      $or: [{ _id: complaintId }, { complaintId }],
    });

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    const duplicateReports = await DuplicateReport.find({
      $or: [
        { originalComplaint: complaint._id },
        { duplicateComplaint: complaint._id },
      ],
    })
      .populate("originalComplaint", "complaintId title status category location aiScore")
      .populate("duplicateComplaint", "complaintId title status category location aiScore")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: duplicateReports.length,
      duplicateReports,
    });
  } catch (error) {
    next(error);
  }
};

const updateDuplicateStatus = async (req, res, next) => {
  try {
    const { mergedStatus } = req.body;

    if (!["Pending", "Merged", "Rejected"].includes(mergedStatus)) {
      res.status(400);
      throw new Error("Invalid duplicate status.");
    }

    const duplicateReport = await DuplicateReport.findById(req.params.id);

    if (!duplicateReport) {
      res.status(404);
      throw new Error("Duplicate report not found.");
    }

    duplicateReport.mergedStatus = mergedStatus;
    await duplicateReport.save();

    return res.status(200).json({
      success: true,
      message: "Duplicate status updated successfully.",
      duplicateReport,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkDuplicate,
  getAllDuplicateReports,
  getDuplicateReportByComplaint,
  updateDuplicateStatus,
};