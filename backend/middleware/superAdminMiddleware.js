const { USER_ROLES } = require("../constants/userRoles");

const superAdminOnly = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(new Error("Not authorized. Please login first."));
  }

  if (req.user.role !== USER_ROLES.SUPER_ADMIN) {
    res.status(403);
    return next(new Error("Super Admin access required."));
  }

  next();
};

module.exports = {
  superAdminOnly,
};