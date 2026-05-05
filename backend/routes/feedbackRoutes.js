const express = require("express");

const {
  createFeedback,
  getMyFeedbacks,
  getAllFeedbacks,
} = require("../controllers/feedbackController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../constants/userRoles");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Feedback routes working",
  });
});

router.post("/", protect, authorizeRoles(USER_ROLES.CITIZEN), createFeedback);

router.get("/my", protect, authorizeRoles(USER_ROLES.CITIZEN), getMyFeedbacks);

router.get(
  "/all",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getAllFeedbacks
);

module.exports = router;