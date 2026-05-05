const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { USER_ROLES, ALL_ROLES } = require("../constants/userRoles");

const sendAuthResponse = (res, statusCode, user, message) => {
  const token = generateToken(user._id, user.role);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("token", token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: user.getPublicProfile(),
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, address, city } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required.");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists with this email.");
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: finalRole,
      address,
      city,
    });

    return sendAuthResponse(res, 201, user, "Registration successful.");
  } catch (error) {
    next(error);
  }
};

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

    if (!user.isActive) {
      res.status(403);
      throw new Error("Your account has been deactivated.");
    }

    const isPasswordMatched = await user.matchPassword(password);

    if (!isPasswordMatched) {
      res.status(401);
      throw new Error("Invalid email or password.");
    }

    user.lastLogin = new Date();
    await user.save();

    return sendAuthResponse(res, 200, user, "Login successful.");
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const allowedFields = ["name", "phone", "address", "city", "profileImage"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    const updatedUser = await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

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

    const isPasswordMatched = await user.matchPassword(currentPassword);

    if (!isPasswordMatched) {
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
  getMyProfile,
  updateMyProfile,
  changePassword,
};
