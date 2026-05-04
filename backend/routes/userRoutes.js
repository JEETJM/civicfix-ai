const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
  activateUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { superAdminOnly } = require("../middleware/superAdminMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);

router.put("/:id/role", protect, superAdminOnly, updateUserRole);
router.put("/:id/deactivate", protect, superAdminOnly, deactivateUser);
router.put("/:id/activate", protect, superAdminOnly, activateUser);

module.exports = router;