const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const sendAuthResponse = (res, statusCode, user) => {
  const token = generateToken(user._id);

  return res.status(statusCode).json({
    success: true,
    token,
    user: user.getPublicProfile(),
  });
};

// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = "citizen",
      city,
      address,
    } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required.");
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters.");
    }

    const allowedRegisterRoles = ["citizen", "department_officer", "admin"];

    if (!allowedRegisterRoles.includes(role)) {
      res.status(400);
      throw new Error("Invalid account type.");
    }

    if (role === "super_admin") {
      res.status(403);
      throw new Error("Super Admin cannot be registered publicly.");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists with this email.");
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      city,
      address,

      // ✅ Admin needs Super Admin approval
      isApproved: role === "admin" ? false : true,
      approvalStatus: role === "admin" ? "Pending" : "Approved",
      isActive: true,
    });

    return sendAuthResponse(res, 201, user);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required.");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password.");
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password.");
    }

    if (user.isActive === false) {
      res.status(403);
      throw new Error("Your account is inactive. Please contact Super Admin.");
    }

    // ✅ Admin pending approval block
    if (user.role === "admin" && !user.isApproved) {
      res.status(403);
      throw new Error(
        user.approvalStatus === "Rejected"
          ? "Your admin account request was rejected by Super Admin."
          : "Your admin account is pending Super Admin approval."
      );
    }

    return sendAuthResponse(res, 200, user);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    return res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/me
const updateMe = async (req, res, next) => {
  try {
    const { name, phone, city, address } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (address !== undefined) user.address = address;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Current password and new password are required.");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters.");
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect.");
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateMe,
  changePassword,
};