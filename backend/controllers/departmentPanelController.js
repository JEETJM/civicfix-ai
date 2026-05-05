const Complaint = require("../models/Complaint");
const Department = require("../models/Department");
const StatusTimeline = require("../models/StatusTimeline");
const ResolutionProof = require("../models/ResolutionProof");
const cloudinary = require("../config/cloudinary");
const { createStatusTimeline } = require("../utils/statusTimeline");

const uploadBufferToCloudinary = async (file, folder) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  return cloudinary.uploader.upload(base64Image, {
    folder,
    resource_type: "image",
  });
};

const getOfficerDepartmentNames = async (user) => {
  const departments = await Department.find({
    $or: [
      { email: user.email },
      { officerEmail: user.email },
      { officerName: user.name },
    ],
  });

  if (departments.length === 0) {
    return [];
  }

  return departments.map((department) => department.name);
};

const getAssignedComplaints = async (req, res, next) => {
  try {
    const { status, urgency, search } = req.query;

    const officerDepartments = await getOfficerDepartmentNames(req.user);

    const query = {};

    if (officerDepartments.length > 0) {
      query.department = { $in: officerDepartments };
    } else if (req.user.department) {
      query.department = req.user.department;
    } else {
      query.department = { $exists: true };
    }

    if (status) query.status = status;
    if (urgency) query.urgency = urgency;

    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
      ];
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

const getAssignedComplaintDetails = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("reportedBy", "name email phone trustScore")
      .populate("assignedDepartmentId", "name category officerName email phone");

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    const timeline = await StatusTimeline.find({
      complaint: complaint._id,
    }).sort({ createdAt: 1 });

    const proof = await ResolutionProof.findOne({
      complaint: complaint._id,
    }).populate("uploadedBy", "name email role");

    return res.status(200).json({
      success: true,
      complaint,
      timeline,
      proof,
    });
  } catch (error) {
    next(error);
  }
};

const updateDepartmentComplaintStatus = async (req, res, next) => {
  try {
    const { status, workRemark = "" } = req.body;

    if (!status) {
      res.status(400);
      throw new Error("Status is required.");
    }

    const allowedStatuses = [
      "Assigned to Department",
      "In Progress",
      "Resolved",
      "Escalated",
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error("Invalid department status.");
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    const oldStatus = complaint.status;
    complaint.status = status;

    if (workRemark) {
      complaint.departmentRemark = workRemark;
    }

    if (status === "Resolved") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    await createStatusTimeline({
      complaint: complaint._id,
      status,
      title: "Department Status Updated",
      message: `Department updated status: ${oldStatus} → ${status}. ${
        workRemark ? `Remark: ${workRemark}` : ""
      }`,
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

const uploadResolutionProof = async (req, res, next) => {
  try {
    const { proofType = "before", workRemark = "" } = req.body;

    if (!req.file) {
      res.status(400);
      throw new Error("Proof image is required.");
    }

    if (!["before", "after"].includes(proofType)) {
      res.status(400);
      throw new Error("Proof type must be before or after.");
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error("Complaint not found.");
    }

    const result = await uploadBufferToCloudinary(
      req.file,
      "civicfix-ai/resolution-proofs"
    );

    let proof = await ResolutionProof.findOne({
      complaint: complaint._id,
    });

    if (!proof) {
      proof = await ResolutionProof.create({
        complaint: complaint._id,
        complaintId: complaint.complaintId,
        department: complaint.department,
        uploadedBy: req.user._id,
        workRemark,
      });
    }

    if (proofType === "before") {
      proof.beforeImageUrl = result.secure_url;
      proof.proofStatus = "Before Uploaded";
    }

    if (proofType === "after") {
      proof.afterImageUrl = result.secure_url;
      proof.proofStatus = proof.beforeImageUrl ? "Completed" : "After Uploaded";
    }

    if (workRemark) {
      proof.workRemark = workRemark;
      complaint.departmentRemark = workRemark;
    }

    await proof.save();
    await complaint.save();

    await createStatusTimeline({
      complaint: complaint._id,
      status: complaint.status,
      title:
        proofType === "before"
          ? "Before Work Proof Uploaded"
          : "After Work Proof Uploaded",
      message: `${proofType} proof image uploaded by department officer. ${
        workRemark ? `Remark: ${workRemark}` : ""
      }`,
      updatedBy: req.user._id,
      updatedByRole: req.user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Resolution proof uploaded successfully.",
      proof,
    });
  } catch (error) {
    next(error);
  }
};

const getDepartmentPerformance = async (req, res, next) => {
  try {
    const officerDepartments = await getOfficerDepartmentNames(req.user);

    const query = {};

    if (officerDepartments.length > 0) {
      query.department = { $in: officerDepartments };
    }

    const [
      assigned,
      inProgress,
      resolved,
      escalated,
      highPriority,
    ] = await Promise.all([
      Complaint.countDocuments(query),
      Complaint.countDocuments({ ...query, status: "In Progress" }),
      Complaint.countDocuments({ ...query, status: "Resolved" }),
      Complaint.countDocuments({ ...query, status: "Escalated" }),
      Complaint.countDocuments({
        ...query,
        urgency: { $in: ["High", "Critical"] },
      }),
    ]);

    const resolutionRate =
      assigned === 0 ? 0 : Math.round((resolved / assigned) * 100);

    return res.status(200).json({
      success: true,
      performance: {
        assigned,
        inProgress,
        resolved,
        escalated,
        highPriority,
        resolutionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignedComplaints,
  getAssignedComplaintDetails,
  updateDepartmentComplaintStatus,
  uploadResolutionProof,
  getDepartmentPerformance,
};