const express = require("express");
const {
  analyzeComplaintPriority,
  getPriorityByComplaint,
  getHighPriorityComplaints,
} = require("../controllers/priorityController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../constants/userRoles");

const router = express.Router();

router.post("/analyze", protect, analyzeComplaintPriority);

router.get(
  "/high-risk",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getHighPriorityComplaints
);

router.get("/:complaintId", protect, getPriorityByComplaint);

module.exports = router;