const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
  getAssignedComplaints,
  getAssignedComplaintDetails,
  updateDepartmentComplaintStatus,
  uploadResolutionProof,
  getDepartmentPerformance,
} = require("../controllers/departmentPanelController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../constants/userRoles");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Department panel routes working",
  });
});

router.get(
  "/performance",
  protect,
  authorizeRoles(USER_ROLES.DEPARTMENT_OFFICER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getDepartmentPerformance
);

router.get(
  "/complaints",
  protect,
  authorizeRoles(USER_ROLES.DEPARTMENT_OFFICER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getAssignedComplaints
);

router.get(
  "/complaints/:id",
  protect,
  authorizeRoles(USER_ROLES.DEPARTMENT_OFFICER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getAssignedComplaintDetails
);

router.put(
  "/complaints/:id/status",
  protect,
  authorizeRoles(USER_ROLES.DEPARTMENT_OFFICER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  updateDepartmentComplaintStatus
);

router.post(
  "/complaints/:id/proof",
  protect,
  authorizeRoles(USER_ROLES.DEPARTMENT_OFFICER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  upload.single("image"),
  uploadResolutionProof
);

module.exports = router;