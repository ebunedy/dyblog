const { userToken, userResetPasswordToken } = require("./create.user.token");
const {
  addTokenToCookie,
  decodeToken,
  createToken,
  createPassResetToken,
  decodePassResetToken,
} = require("./user.jwt");

module.exports = {
  userToken,
  decodeToken,
  createToken,
  addTokenToCookie,
  createPassResetToken,
  userResetPasswordToken,
  decodePassResetToken,
};
