const userToken = (user) => {
  return {
    username: user.username,
    userId: user._id,
  };
};

module.exports = userToken;
