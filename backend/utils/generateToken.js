const jwt = require("jsonwebtoken");
const env = require("../config/env");

const generateToken = (userId, role) => {
  return jwt.sign(
    {
      id: userId,
      role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRE,
    }
  );
};

module.exports = generateToken;