const Complaint = require("../models/Complaint");
const Department = require("../models/Department");
const StatusTimeline = require("../models/StatusTimeline");
const { createStatusTimeline } = require("../utils/statusTimeline");

const getAdminComplaints = async (req, res, next) => {
  try {
    const { status, category, urgency, search } = req.query;

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;

    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate("reportedBy", "name email phone role trustScore")
      .populate("assignedDepartmentId", "name category officerName email phone")
      .populate("duplicateOf", "complaintId title status aiScore")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminComplaintDetails = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("reportedBy", "name email phone role trustScore")
      .populate("assignedDepartmentId", "name category officerName email phone")
      .populate("duplicateOf", "complaintId title status aiScore");

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    const timeline = await StatusTimeline.find({
      complaint: complaint._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      complaint,
      timeline,
    });
  } catch (error) {
    next(error);
  }
};

const updateComplaintByAdmin = async (req, res, next) => {
  try {
    const {
      status,
      category,
      urgency,
      aiScore,
      department,
      adminRemark,
    } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    const oldStatus = complaint.status;

    if (status) complaint.status = status;
    if (category) complaint.category = category;
    if (urgency) complaint.urgency = urgency;
    if (aiScore !== undefined && aiScore !== "") complaint.aiScore = Number(aiScore);
    if (adminRemark !== undefined) complaint.adminRemark = adminRemark;

    if (department) {
      const departmentDoc = await Department.findOne({ name: department });

      complaint.department = department;
      complaint.assignedDepartmentId = departmentDoc ? departmentDoc._id : null;
    }

    await complaint.save();

    await createStatusTimeline({
      complaint: complaint._id,
      status: complaint.status,
      title: "Admin Updated Complaint",
      message: `Admin updated complaint. Status: ${oldStatus} → ${complaint.status}. ${
        department ? `Assigned to ${department}.` : ""
      } ${adminRemark ? `Remark: ${adminRemark}` : ""}`,
      updatedBy: req.user._id,
      updatedByRole: req.user.role,
    });

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate("reportedBy", "name email phone role trustScore")
      .populate("assignedDepartmentId", "name category officerName email phone")
      .populate("duplicateOf", "complaintId title status aiScore");

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully.",
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({}).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminComplaints,
  getAdminComplaintDetails,
  updateComplaintByAdmin,
  getAdminDepartments,
};