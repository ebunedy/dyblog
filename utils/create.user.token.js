const userToken = (user) => {
  return {
    username: user.username,
    userId: user._id,
  };
};

const userResetPasswordToken = (user) => {
  return {
    username: user.username,
    email: user.email,
  };
};

module.exports = { userToken, userResetPasswordToken };
