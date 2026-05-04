const Complaint = require("../models/Complaint");
const Department = require("../models/Department");
const StatusTimeline = require("../models/StatusTimeline");
const generateComplaintId = require("../utils/generateComplaintId");
const { getDepartmentByCategory } = require("../utils/departmentMapper");
const { createStatusTimeline } = require("../utils/statusTimeline");
const { COMPLAINT_STATUS } = require("../constants/complaintStatus");
const { USER_ROLES } = require("../constants/userRoles");
const PriorityScore = require("../models/PriorityScore");
const { analyzeAndSavePriority } = require("../services/aiPriorityService");

const createComplaint = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category = "",
      imageUrl = "",
      location,
    } = req.body;

    if (!title || !description || !location || !location.address) {
      res.status(400);
      throw new Error("Title, description and address are required.");
    }

    const aiPreview = require("../utils/aiScoring").analyzeComplaintText({
      title,
      description,
      selectedCategory: category,
    });

    const departmentName = aiPreview.department;
    const department = await Department.findOne({ name: departmentName });

    const complaint = await Complaint.create({
      complaintId: generateComplaintId(),
      title,
      description,
      category: aiPreview.category,
      urgency: aiPreview.urgency,
      aiScore: aiPreview.aiScore,
      aiReason: aiPreview.aiReason,
      department: departmentName,
      assignedDepartmentId: department ? department._id : null,
      imageUrl,
      location,
      status: COMPLAINT_STATUS.AI_ANALYZED,
      reportedBy: req.user._id,
      escalationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    const { priorityScore } = await analyzeAndSavePriority({
      complaint,
      complaintId: complaint.complaintId,
      title,
      description,
      selectedCategory: aiPreview.category,
    });

    await createStatusTimeline({
      complaint: complaint._id,
      status: COMPLAINT_STATUS.SUBMITTED,
      title: "Complaint Submitted",
      message: "Your complaint has been submitted successfully.",
      updatedBy: req.user._id,
      updatedByRole: req.user.role,
    });

    await createStatusTimeline({
      complaint: complaint._id,
      status: COMPLAINT_STATUS.AI_ANALYZED,
      title: "AI Priority Analysis Completed",
      message: `AI score ${aiPreview.aiScore}/100, urgency ${aiPreview.urgency}, department ${departmentName}.`,
      updatedBy: req.user._id,
      updatedByRole: "system",
    });

    if (department) {
      department.activeComplaints += 1;
      await department.save();
    }

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate("reportedBy", "name email phone role")
      .populate("assignedDepartmentId", "name category officerName email phone");

    return res.status(201).json({
      success: true,
      message: "Complaint created and AI analyzed successfully.",
      complaint: populatedComplaint,
      priorityScore,
    });
  } catch (error) {
    next(error);
  }
};
const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ reportedBy: req.user._id })
      .populate("assignedDepartmentId", "name category officerName email phone")
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

const getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, urgency, department, search } = req.query;

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (department) query.department = department;

    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate("reportedBy", "name email phone role")
      .populate("assignedTo", "name email phone role")
      .populate("assignedDepartmentId", "name category officerName email phone")
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

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("reportedBy", "name email phone role trustScore")
      .populate("assignedTo", "name email phone role")
      .populate("assignedDepartmentId", "name category officerName email phone");

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    const isOwner = complaint.reportedBy._id.toString() === req.user._id.toString();
    const isAdmin =
      req.user.role === USER_ROLES.ADMIN || req.user.role === USER_ROLES.SUPER_ADMIN;
    const isDepartmentOfficer = req.user.role === USER_ROLES.DEPARTMENT_OFFICER;

    if (!isOwner && !isAdmin && !isDepartmentOfficer) {
      res.status(403);
      throw new Error("Access denied for this complaint.");
    }

    const timeline = await StatusTimeline.find({ complaint: complaint._id })
      .populate("updatedBy", "name email role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      complaint,
      timeline,
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintByComplaintId = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.complaintId,
    })
      .populate("reportedBy", "name email phone role")
      .populate("assignedTo", "name email phone role")
      .populate("assignedDepartmentId", "name category officerName email phone");

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    const timeline = await StatusTimeline.find({ complaint: complaint._id })
      .populate("updatedBy", "name email role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      complaint,
      timeline,
    });
  } catch (error) {
    next(error);
  }
};

const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, remark = "" } = req.body;

    if (!status) {
      res.status(400);
      throw new Error("Status is required.");
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    complaint.status = status;

    if (req.user.role === USER_ROLES.DEPARTMENT_OFFICER) {
      complaint.departmentRemark = remark;
    } else {
      complaint.adminRemark = remark;
    }

    await complaint.save();

    await createStatusTimeline({
      complaint: complaint._id,
      status,
      title: `Status Updated: ${status}`,
      message: remark || `Complaint status changed to ${status}.`,
      updatedBy: req.user._id,
      updatedByRole: req.user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

const assignDepartment = async (req, res, next) => {
  try {
    const { departmentId } = req.body;

    if (!departmentId) {
      res.status(400);
      throw new Error("Department ID is required.");
    }

    const department = await Department.findById(departmentId);

    if (!department) {
      res.status(404);
      throw new Error("Department not found.");
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    complaint.assignedDepartmentId = department._id;
    complaint.department = department.name;
    complaint.status = COMPLAINT_STATUS.ASSIGNED;

    await complaint.save();

    await createStatusTimeline({
      complaint: complaint._id,
      status: COMPLAINT_STATUS.ASSIGNED,
      title: "Complaint Assigned",
      message: `Complaint assigned to ${department.name}.`,
      updatedBy: req.user._id,
      updatedByRole: req.user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Department assigned successfully.",
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

const getDepartmentAssignedComplaints = async (req, res, next) => {
  try {
    const department = await Department.findOne({
      email: req.user.email,
    });

    let query = {};

    if (department) {
      query.assignedDepartmentId = department._id;
    } else {
      query.department = { $regex: req.query.department || "", $options: "i" };
    }

    const complaints = await Complaint.find(query)
      .populate("reportedBy", "name email phone")
      .populate("assignedDepartmentId", "name category officerName email phone")
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

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  getComplaintByComplaintId,
  updateComplaintStatus,
  assignDepartment,
  getDepartmentAssignedComplaints,
};