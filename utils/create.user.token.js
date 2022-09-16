const userToken = (user) => {
  return {
    firstname: user.first_name,
    userId: user._id,
  };
};

module.exports = userToken