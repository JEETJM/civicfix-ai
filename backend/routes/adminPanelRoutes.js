const express = require("express");

const {
  getAdminComplaints,
  getAdminComplaintDetails,
  updateComplaintByAdmin,
  getAdminDepartments,
} = require("../controllers/adminPanelController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../constants/userRoles");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin panel routes working",
  });
});

router.get(
  "/complaints",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getAdminComplaints
);

router.get(
  "/complaints/:id",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getAdminComplaintDetails
);

router.put(
  "/complaints/:id",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  updateComplaintByAdmin
);

router.get(
  "/departments",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getAdminDepartments
);

module.exports = router;