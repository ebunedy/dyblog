const userToken = (user) => {
  return {
    username: user.username,
    userId: user._id,
    role: user.role,
  };
};

const userResetPasswordToken = (user) => {
  return {
    username: user.username,
    email: user.email,
  };
};

module.exports = { userToken, userResetPasswordToken };
