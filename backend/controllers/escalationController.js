const Complaint = require("../models/Complaint");
const EscalationLog = require("../models/EscalationLog");
const { createStatusTimeline } = require("../utils/statusTimeline");
const {
  shouldEscalateComplaint,
  getEscalationReason,
} = require("../utils/escalationChecker");

const getEscalations = async (req, res, next) => {
  try {
    const escalations = await EscalationLog.find({})
      .populate("complaint", "title status urgency department location")
      .populate("escalatedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: escalations.length,
      escalations,
    });
  } catch (error) {
    next(error);
  }
};

const manualEscalateComplaint = async (req, res, next) => {
  try {
    const { reason = "Manual escalation by admin." } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    complaint.status = "Escalated";
    complaint.isEscalated = true;
    complaint.escalatedAt = new Date();
    await complaint.save();

    const escalation = await EscalationLog.create({
      complaint: complaint._id,
      complaintId: complaint.complaintId,
      oldLevel: "Department Officer",
      newLevel: "Admin / Super Admin",
      reason,
      escalatedBy: req.user._id,
      escalationType: "Manual",
      status: "Open",
    });

    await createStatusTimeline({
      complaint: complaint._id,
      status: "Escalated",
      title: "Complaint Escalated",
      message: reason,
      updatedBy: req.user._id,
      updatedByRole: req.user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint escalated successfully.",
      escalation,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

const runAutoEscalationCheck = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({
      status: {
        $in: [
          "Submitted",
          "AI Analyzed",
          "Duplicate Checked",
          "Assigned to Department",
          "In Progress",
        ],
      },
      isEscalated: { $ne: true },
    });

    const escalated = [];

    for (const complaint of complaints) {
      if (shouldEscalateComplaint(complaint)) {
        const reason = getEscalationReason(complaint);

        complaint.status = "Escalated";
        complaint.isEscalated = true;
        complaint.escalatedAt = new Date();
        await complaint.save();

        const log = await EscalationLog.create({
          complaint: complaint._id,
          complaintId: complaint.complaintId,
          oldLevel: "Department Officer",
          newLevel: "Admin / Super Admin",
          reason,
          escalationType: "Auto",
          status: "Open",
        });

        await createStatusTimeline({
          complaint: complaint._id,
          status: "Escalated",
          title: "Auto Escalation Triggered",
          message: reason,
          updatedBy: null,
          updatedByRole: "system",
        });

        escalated.push(log);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Auto escalation check completed.",
      escalatedCount: escalated.length,
      escalated,
    });
  } catch (error) {
    next(error);
  }
};

const updateEscalationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const escalation = await EscalationLog.findById(req.params.id);

    if (!escalation) {
      res.status(404);
      throw new Error("Escalation not found.");
    }

    escalation.status = status || escalation.status;
    await escalation.save();

    return res.status(200).json({
      success: true,
      message: "Escalation status updated.",
      escalation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEscalations,
  manualEscalateComplaint,
  runAutoEscalationCheck,
  updateEscalationStatus,
};