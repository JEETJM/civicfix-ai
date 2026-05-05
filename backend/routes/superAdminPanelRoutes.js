const express = require("express");

const {
  getAllUsersForSuperAdmin,
  updateUserBySuperAdmin,
  getDepartmentManagement,
  createDepartmentBySuperAdmin,
  updateDepartmentBySuperAdmin,
  getSuperAdminStats,
} = require("../controllers/superAdminPanelController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../constants/userRoles");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Super admin panel routes working",
  });
});

router.get(
  "/stats",
  protect,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  getSuperAdminStats
);

router.get(
  "/users",
  protect,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  getAllUsersForSuperAdmin
);

router.put(
  "/users/:id",
  protect,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  updateUserBySuperAdmin
);

router.get(
  "/departments",
  protect,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  getDepartmentManagement
);

router.post(
  "/departments",
  protect,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  createDepartmentBySuperAdmin
);

router.put(
  "/departments/:id",
  protect,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  updateDepartmentBySuperAdmin
);

module.exports = router;