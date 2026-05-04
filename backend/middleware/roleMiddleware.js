const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error("Not authorized. Please login first."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`Access denied. Required role: ${allowedRoles.join(", ")}`)
      );
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
};