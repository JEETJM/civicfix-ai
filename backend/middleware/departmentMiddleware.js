const { USER_ROLES } = require("../constants/userRoles");

const departmentOnly = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(new Error("Not authorized. Please login first."));
  }

  if (req.user.role !== USER_ROLES.DEPARTMENT_OFFICER) {
    res.status(403);
    return next(new Error("Department Officer access required."));
  }

  next();
};

module.exports = {
  departmentOnly,
};