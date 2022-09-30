const User = require("../models/user.model");
const Post = require("../models/post.model");
const { BadrequestError, NotFoundError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const publicProfile = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username }).select("-password");
  if (!user) {
    throw new NotFoundError("user not found");
  }
  const postsByUser =
    (await Post.find({ postBy: user._id })
      .populate("categories", "_id name")
      .populate("tags", "_id name")
      .populate("posteBy")
      .select(
        "_id title body excerpt categories tags postedBy createdAt updatedAt"
      )) || [];
  res.status(StatusCodes.OK).json({ user, posts: postsByUser });
};

module.exports = { publicProfile };
