const Comment = require("../models/comment.model");
const { BadrequestError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const createComment = async (req, res) => {
  const { comment, post, user } = req.body;
  const commentExist = await Comment.find({ user: user });
  if (!commentExist) throw new BadrequestError("comment already exist");
  const newComment = await Comment.create({ comment, user, post });
  if (!newComment) throw new BadrequestError("failed to create comment");
  res.status(StatusCodes.OK).json({ message: "comment create successfully" });
};

const deleteComment = async (req, res) => {
  const id = req.params.postId;
  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) throw new BadrequestError("failed to delete comment");
  res.status(StatusCodes.OK).json({ message: "comment deleted successfully" });
};

module.exports = { createComment, deleteComment };
