const express = require("express");

const {
  checkDuplicate,
  getAllDuplicateReports,
  getDuplicateReportByComplaint,
  updateDuplicateStatus,
} = require("../controllers/duplicateController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../constants/userRoles");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Duplicate routes working",
  });
});

router.post("/check", protect, checkDuplicate);

router.get(
  "/all",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getAllDuplicateReports
);

router.get("/:complaintId", protect, getDuplicateReportByComplaint);

router.put(
  "/:id/status",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  updateDuplicateStatus
);

module.exports = router;