const express = require("express");

const {
  getAnalyticsSummary,
  getDashboardAnalytics,
  getCategoryAnalytics,
  getStatusAnalytics,
  getUrgencyAnalytics,
  getDepartmentAnalytics,
  getAreaAnalytics,
  getRecentComplaintAnalytics,
} = require("../controllers/analyticsController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../constants/userRoles");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Analytics routes working",
  });
});

router.get(
  "/summary",
  protect,
  authorizeRoles(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DEPARTMENT_OFFICER
  ),
  getAnalyticsSummary
);

router.get(
  "/dashboard",
  protect,
  authorizeRoles(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DEPARTMENT_OFFICER
  ),
  getDashboardAnalytics
);

router.get(
  "/category-wise",
  protect,
  authorizeRoles(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DEPARTMENT_OFFICER
  ),
  getCategoryAnalytics
);

router.get(
  "/status-wise",
  protect,
  authorizeRoles(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DEPARTMENT_OFFICER
  ),
  getStatusAnalytics
);

router.get(
  "/priority-wise",
  protect,
  authorizeRoles(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DEPARTMENT_OFFICER
  ),
  getUrgencyAnalytics
);

router.get(
  "/department-wise",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getDepartmentAnalytics
);

router.get(
  "/area-wise",
  protect,
  authorizeRoles(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DEPARTMENT_OFFICER
  ),
  getAreaAnalytics
);

router.get(
  "/recent",
  protect,
  authorizeRoles(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DEPARTMENT_OFFICER
  ),
  getRecentComplaintAnalytics
);

module.exports = router;