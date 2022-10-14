const { StatusCodes } = require("http-status-codes");
const Tag = require("../models/tag.model");
const Post = require("../models/post.model");
const { BadrequestError } = require("../errors");

const createTag = async (req, res) => {
  const name = req.body.name.toLowerCase();
  const tagExist = await Tag.findOne({ name });
  if (tagExist) throw new BadrequestError("tag is already available");
  const tag = await Tag.create({ name });
  if (!tag) throw new BadrequestError("failed to create tag");
  res.status(StatusCodes.OK).json({ message: "tag created successfully", tag });
};
//Lovedy55

const listTags = async (req, res) => {
  const tags = await Tag.find({});
  if (!tags) throw new BadrequestError("failed to fetch tags");
  res.status(StatusCodes.OK).json({ tags });
};

const postsByTags = async (req, res) => {
  const tagName = req.params.tagName.toLowerCase();
  const tag = await Post.findOne({ name: tagName });
  if (!tag) throw new BadrequestError("no tag with that name");

  const posts =
    (await Post.find({ tags: tag._id })
      .populate("categories")
      .populate("tags")
      .populate("postedBy", "_id, name, username")
      .select(
        "_id title excerpt categories tags postedBy createdAt updatedAt"
      )) || [];
  res.status(StatusCodes.OK).json({ tag: tagName, posts });
};

const deleteTag = async (req, res) => {
  const id = req.params.tagId;
  const tag = await Tag.findByIdAndDelete(id);
  if (!tag) throw new BadrequestError("failed to delete tag");
  res.status(StatusCodes.OK).json({ message: "tag deleted successfully" });
};

const updateTag = async (req, res) => {
  const id = req.params.tagId;
  const tag = await Tag.findByIdAndUpdate(id, { name: req.body.name });
  if (!tag) throw new BadrequestError("failed to update tag");
  res.status(StatusCodes.OK).json({ message: "tag updated successfully" });
};

module.exports = {
  createTag,
  listTags,
  postsByTags,
  updateTag,
  deleteTag,
};
