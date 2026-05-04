const { USER_ROLES } = require("../constants/userRoles");

const adminOnly = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(new Error("Not authorized. Please login first."));
  }

  if (
    req.user.role !== USER_ROLES.ADMIN &&
    req.user.role !== USER_ROLES.SUPER_ADMIN
  ) {
    res.status(403);
    return next(new Error("Admin access required."));
  }

  next();
};

module.exports = {
  adminOnly,
};