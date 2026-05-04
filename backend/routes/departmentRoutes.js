const express = require("express");
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { superAdminOnly } = require("../middleware/superAdminMiddleware");

const router = express.Router();

router.get("/", protect, getAllDepartments);
router.get("/:id", protect, getDepartmentById);

router.post("/", protect, superAdminOnly, createDepartment);
router.put("/:id", protect, superAdminOnly, updateDepartment);
router.delete("/:id", protect, superAdminOnly, deleteDepartment);

module.exports = router;