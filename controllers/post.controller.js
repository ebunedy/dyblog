const Post = require("../models/post.model");
const Tag = require("../models/tag.model");
const { BadrequestError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const smartTrim = require("../helper/smart.trim");

const createPost = async (req, res) => {
  const { title, body, tags } = req.body;
  if (!title || !body || !tags)
    throw new BadrequestError("title, body, tags are all required");
  req.body.excerpt = smartTrim(req.body, 380, "</p>", " ...");
  req.body.postedBy = req.user._id;
  const { excerpt } = req.body;
  const postExist = await Post.findOne({ title, excerpt });
  if (postExist)
    throw BadrequestError(
      "post might already exist. please make changes to the post body"
    );

  const post = await Post.create(req.body);
  if (!post) throw new BadrequestError("failed to create post");
  res.status(StatusCodes.OK).json({ message: "post created successfully" });
};

const searchSortPaginatePosts = async (req, res) => {
  const { search, sort } = req.query;
  const queryObject = {};
  if (search)
    queryObject.$or = [
      { title: { $regex: search, $options: "i" } },
      { body: { $regex: search, $options: "i" } },
    ];
  let sortPosts = Post.find(queryObject);
  if (sort === "latest") sortPosts = sortPosts.sort("-createdAt");
  if (sort === "oldest") sortPosts = sortPosts.sort("createdAt");

  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  sortPosts = sortPosts.skip(skip).limit(limit);

  const posts =
    (await sortPosts
      .populate("tags")
      .populate("postedBy", "_id, name, username")
      .select("-createdAt -updatedAt")) || [];

  res.status(StatusCodes.OK).json({ posts });
};

const allPosts = async (req, res) => {
  const posts =
    (await Post.find({})
      .populate("tags")
      .populate("postedBy", "_id, name, username")
      .sort("-createdAt")
      .select("-createdAt -updatedAt")) || [];
  res.status(StatusCodes.OK).json({ posts });
};

const getSinglePost = async (req, res) => {
  const id = req.params.postId;
  const post = await Post.findById(id)
    .populate("tags")
    .populate("postedBy", "_id, name, username")
    .select("-excerpt");
  if (!post) throw new BadrequestError("failed to fetch post");
  res.status(StatusCodes.OK).json({ post });
};

const relatedPost = async (req, res) => {
  const { tag } = req.query;
  const id = req.params.postId;
  const objectQuery = { _id: { $ne: id } };
  if (tags) objectQuery.tags = { $in: tag };
  if (!tag)
    throw new BadrequestError(
      "please provide either a tag to get related post"
    );
  const posts = await Post.find(objectQuery);
  res.status(StatusCodes.OK).json({ relatedPosts: posts });
};

const prePostUpdate = async (req, res) => {
  const id = req.params.postId;
  const post = await Post.findById(id)
    .populate("tags")
    .select("-excerpt");
  const tags = await Tag.find({});
  if (!post) throw new BadrequestError("failed to fetch post");
  if (!tags) throw new BadrequestError("failed to fetch tags");
  res.status(StatusCodes.OK).json({ post, tags });
};

const updatePost = async (req, res) => {
  const id = req.params.postId;
  if (req.body.body) req.body.excerpt = smartTrim(req.body, 380, "</p>", " ...");
  const post = await Post.findByIdAndUpdate(id, req.body);
  if (!post) throw new BadrequestError("failed to update post");
  res.status(StatusCodes.OK).json({ message: "post updated successfully" });
};

const deletePost = async (req, res) => {
  const id = req.params.postId;
  const post = await Post.findByIdAndDelete(id);
  if (!post) throw new BadrequestError("failed to delete post");
  res.status(StatusCodes.OK).status({ message: "post deleted successfully" });
};

const addLike = async (req, res) => {
  const { postId, userId } = req.body;
  const post = await Post.findByIdAndUpdate(postId, {
    $addToSet: { likes: userId },
  });
  if (!post) throw BadrequestError("failed to add like");
  res.status(StatusCodes.OK).json({
    message: `like added successfully`,
  });
};

const removeLike = async (req, res) => {
  const { postId, userId } = req.body;
  const post = await Post.findByIdAndUpdate(postId, {
    $pull: { likes: userId },
  });
  if (!post) throw BadrequestError("failed to remove like");
  res.status(StatusCodes.OK).json({
    message: `like removed successfully`,
  });
};

module.exports = {
  createPost,
  allPosts,
  searchSortPaginatePosts,
  getSinglePost,
  relatedPost,
  prePostUpdate,
  updatePost,
  deletePost,
  addLike,
  removeLike,
};
