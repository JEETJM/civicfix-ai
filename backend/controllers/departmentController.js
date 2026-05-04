const Department = require("../models/Department");

const getAllDepartments = async (req, res, next) => {
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

const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404);
      throw new Error("Department not found.");
    }

    return res.status(200).json({
      success: true,
      department,
    });
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      department,
    });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404);
      throw new Error("Department not found.");
    }

    Object.keys(req.body).forEach((key) => {
      department[key] = req.body[key];
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

const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404);
      throw new Error("Department not found.");
    }

    department.isActive = false;
    await department.save();

    return res.status(200).json({
      success: true,
      message: "Department deactivated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};