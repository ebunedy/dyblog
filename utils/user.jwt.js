const jsonwebtoken = require("jsonwebtoken");

/** create token */
const createToken = ({ payload }) => {
  return jsonwebtoken.sign(payload, process.env.JWT_APP_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRATION,
  });
};

/** verify token */
const decodeToken = (token) => {
  return jsonwebtoken.verify(token, process.env.JWT_APP_SECRET);
};

/** verify password reset token */
const decodePreAndResetToken = (token) => {
  return jsonwebtoken.verify(token, process.env.PASS_RESET_SECRET);
};

/** create password reset token */
const createPreAndResetToken = ({ payload }) => {
  return jsonwebtoken.sign(payload, process.env.RESET_PRE_SECRET, {
    expiresIn: process.env.RESET_PRE_SECRET_EXPIRATION,
  });
};

module.exports = {
  decodeToken,
  createToken,
  createPreAndResetToken,
  decodePreAndResetToken,
};
