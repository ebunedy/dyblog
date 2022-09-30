const User = require("../models/user.model");
const Post = require("../models/post.model");
const { BadrequestError, NotFoundError } = require("../errors/index");

const publicProfile = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });
  if (!user) {
    throw new NotFoundError("user not found");
  }
  const postsByUser = await Post.find({ postBy: user._id });
};
