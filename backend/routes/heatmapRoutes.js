const express = require("express");

const {
  getPublicHeatmap,
  regenerateHeatmap,
  getSavedHeatmapZones,
  getHighPriorityZones,
  getResolvedZones,
} = require("../controllers/heatmapController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../constants/userRoles");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Heatmap routes working",
  });
});

router.get("/public", getPublicHeatmap);

router.post(
  "/regenerate",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  regenerateHeatmap
);

router.get(
  "/zones",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getSavedHeatmapZones
);

router.get(
  "/high-priority",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getHighPriorityZones
);

router.get(
  "/resolved-zones",
  protect,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  getResolvedZones
);

module.exports = router;