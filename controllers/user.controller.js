const User = require("../models/user.model");
const Post = require("../models/post.model");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
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

const imageUpload = async (req, res) => {
  const file = req.files;
  if (!file) {
    throw new BadrequestError("no file upload");
  }
  if (!file.image.mimetype.startsWith("image")) {
    throw new BadrequestError("please upload image");
  }
  const maxSize = 1024 * 1024;
  if (file.image.size > maxSize) {
    throw new BadrequestError("Please upload image smaller 1MB");
  }
  const result = await cloudinary.uploader.upload(file.image.tempFilePath, {
    unique_filename: false,
    use_filename: true,
    folder: "file-upload",
  });
  fs.unlinkSync(file.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ src: result.secure_url });
};

module.exports = { publicProfile, imageUpload };
