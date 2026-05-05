const express = require("express");

const {
  getEscalations,
  manualEscalateComplaint,
  runAutoEscalationCheck,
  updateEscalationStatus,
} = require("../controllers/escalationController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../constants/userRoles");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Escalation routes working",
  });
});

router.get(
  "/",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getEscalations
);

router.post(
  "/run-check",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  runAutoEscalationCheck
);

router.post(
  "/complaints/:id/manual",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  manualEscalateComplaint
);

router.put(
  "/:id",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  updateEscalationStatus
);

module.exports = router;