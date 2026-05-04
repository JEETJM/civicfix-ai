const express = require("express");
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  getComplaintByComplaintId,
  updateComplaintStatus,
  assignDepartment,
  getDepartmentAssignedComplaints,
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { departmentOnly } = require("../middleware/departmentMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../constants/userRoles");

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/my", protect, getMyComplaints);

router.get(
  "/all",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getAllComplaints
);

router.get(
  "/department/assigned",
  protect,
  departmentOnly,
  getDepartmentAssignedComplaints
);

router.get("/track/:complaintId", protect, getComplaintByComplaintId);
router.get("/:id", protect, getComplaintById);

router.put(
  "/:id/status",
  protect,
  authorizeRoles(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DEPARTMENT_OFFICER
  ),
  updateComplaintStatus
);

router.put(
  "/:id/assign-department",
  protect,
  adminOnly,
  assignDepartment
);

module.exports = router;