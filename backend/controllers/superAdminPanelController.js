const User = require("../models/User");
const Department = require("../models/Department");
const Complaint = require("../models/Complaint");
const DuplicateReport = require("../models/DuplicateReport");

const getAllUsersForSuperAdmin = async (req, res, next) => {
  try {
    const { role, search } = req.query;

    const query = {};

    if (role) query.role = role;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserBySuperAdmin = async (req, res, next) => {
  try {
    const { role, isActive, trustScore, name, phone, city, address } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (trustScore !== undefined && trustScore !== "") user.trustScore = Number(trustScore);
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (address !== undefined) user.address = address;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: user.getPublicProfile ? user.getPublicProfile() : user,
    });
  } catch (error) {
    next(error);
  }
};

const getDepartmentManagement = async (req, res, next) => {
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

const createDepartmentBySuperAdmin = async (req, res, next) => {
  try {
    const {
      name,
      category,
      officerName,
      email,
      phone,
      description,
    } = req.body;

    if (!name || !category) {
      res.status(400);
      throw new Error("Department name and category are required.");
    }

    const exists = await Department.findOne({ name });

    if (exists) {
      res.status(400);
      throw new Error("Department already exists.");
    }

    const department = await Department.create({
      name,
      category,
      officerName,
      email,
      phone,
      description,
      activeComplaints: 0,
      resolvedComplaints: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      department,
    });
  } catch (error) {
    next(error);
  }
};

const updateDepartmentBySuperAdmin = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404);
      throw new Error("Department not found.");
    }

    const allowedFields = [
      "name",
      "category",
      "officerName",
      "email",
      "phone",
      "description",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        department[field] = req.body[field];
      }
    });

    await department.save();

    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      department,
    });
  } catch (error) {
    next(error);
  }
};

const getSuperAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalOfficers,
      totalCitizens,
      totalDepartments,
      totalComplaints,
      totalDuplicates,
      activeUsers,
      inactiveUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "department_officer" }),
      User.countDocuments({ role: "citizen" }),
      Department.countDocuments(),
      Complaint.countDocuments(),
      DuplicateReport.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalOfficers,
        totalCitizens,
        totalDepartments,
        totalComplaints,
        totalDuplicates,
        activeUsers,
        inactiveUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsersForSuperAdmin,
  updateUserBySuperAdmin,
  getDepartmentManagement,
  createDepartmentBySuperAdmin,
  updateDepartmentBySuperAdmin,
  getSuperAdminStats,
};