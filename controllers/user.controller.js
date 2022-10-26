const User = require("../models/user.model");
const Post = require("../models/post.model");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { BadrequestError, NotFoundError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const userPublicProfile = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username })
    .populate("following", "-password -resetPasswordLink -role")
    .populate("followers", "-password -resetPasswordLink -role")
    .select("-password -resetPasswordLink -role");
  if (!user) throw new NotFoundError("user not found");
  let postsByUser = Post.find({
    author: user._id,
    state: "published",
  }).sort("-createdAt");

  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  postsByUser = postsByUser.skip(skip).limit(limit);
  const sortedPostsByUser = await postsByUser
    .populate("tags", "_id name")
    .select("_id title excerpt categories tags author createdAt updatedAt");
  res.status(StatusCodes.OK).json({ user, posts: sortedPostsByUser });
};

const userProfile = async (req, res) => {
  const { state } = req.query;
  if (req.user === undefined) {
    res.json({ message: "you have to be logged in to see this page" });
  } else {
    const user = await User.findById(req.user._id)
      .populate("following", "-password -resetPasswordLink -role")
      .populate("followers", "-password -resetPasswordLink -role")
      .select("-password -resetPasswordLink -role");
    if (!user) throw new NotFoundError("user not found");

    const queryObject = {
      postedBy: user._id,
    };

    if (state) queryObject.state = state.toLowerCase();
    let postsByUser = Post.find(queryObject).sort("-createdAt");
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    postsByUser = postsByUser.skip(skip).limit(limit);
    const sortedPostsByUser = await postsByUser
      .populate("tags", "_id name")
      .select("_id title excerpt categories tags author createdAt updatedAt");
    res.status(StatusCodes.OK).json({ user, posts: sortedPostsByUser });
  }
};

const imageUpload = async (req, res) => {
  if (!req.files) throw new BadRequestError("No File Uploaded");

  const image = req.files.image;
  if (!image.mimetype.startsWith("image"))
    throw new BadRequestError("please upload image");

  const maxSize = (1024 * 1024) / 2;

  if (image.size > maxSize)
    throw new BadrequestError("Please upload image smaller than 500kb");

  const result = await cloudinary.uploader.upload(image.tempFilePath, {
    unique_filename: false,
    use_filename: true,
    folder: "file-upload",
  });
  fs.unlinkSync(image.tempFilePath);
  return res.status(StatusCodes.OK).json({ src: result.secure_url });
};

const preUserUpdate = async (req, res) => {
  const user = await User.find(req.user._id).select(
    "-password -createdAt -updatedAt"
  );
  if (!user) throw new NotFoundError("user not found");
  res.status(StatusCodes.OK).json({ user });
};

const userUpdate = async (req, res) => {
  if (req.body.password)
    throw new BadrequestError(
      "to update password, go to password reset page. update other fields"
    );
  const user = await User.findByIdAndUpdate(req.user._id, req.body);
  if (!user) throw new BadrequestError("failed to update user");
  res.status(StatusCodes.OK).json({ message: "user updated successfully" });
};

const deleteUser = async (req, res) => {
  const { username } = req.body;
  const user = await User.findOneAndDelete({ username });
  if (!user) throw new BadrequestError("failed to delete user");
  res.status(StatusCodes.OK).json({ message: "user deleted successfully" });
};

const addFollowing = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { following: req.body.followId },
  });
  if (!user)
    throw BadrequestError(
      "failed to add to the list of following. user you are trying to add does not exist"
    );
  const newFollowing = await User.findById(req.body.followId);
  res.status(StatusCodes.OK).json({
    message: `${newFollowing?.username} added to the list of following`,
  });
};

const addFollower = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.body.followId, {
    $addToSet: { followers: req.user._id },
  });
  if (!user)
    throw new BadrequestError(
      "failed to add to the list of your followers. user you are trying to add does not exist"
    );
  const newFollower = await User.findById(req.user._id);
  res.status(StatusCodes.OK).json({
    message: `${newFollower?.username} added to the list of your followers`,
  });
};

const removeFollowing = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { following: req.body.followId },
  });
  if (!user)
    throw BadrequestError("failed to remove from the list of your following");
  const newFollowing = await User.findById(req.body.followId);
  res.status(StatusCodes.OK).json({
    message: `${newFollowing?.username} removed from the list of your following`,
  });
};

const removeFollower = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.body.followId, {
    $pull: { followers: req.user._id },
  });
  if (!user)
    throw BadrequestError("failed to remove from the list of followers");
  const newFollower = await User.findById(req.user._id);
  res.status(StatusCodes.OK).json({
    message: `${newFollower?.username} removed from the list of your followers`,
  });
};

module.exports = {
  userPublicProfile,
  userProfile,
  imageUpload,
  preUserUpdate,
  userUpdate,
  deleteUser,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
};
