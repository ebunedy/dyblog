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

/** add token to cookie */
const addTokenToCookie = ({ res, user }) => {
  const token = createToken({ payload: user });
  const cookieExpiration = 1000 * 60 * 60;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + cookieExpiration),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = {
  addTokenToCookie,
  decodeToken,
  createToken,
  createPreAndResetToken,
  decodePreAndResetToken,
};
