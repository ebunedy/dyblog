const Category = require("../models/category.model");
const Post = require("../models/post.model");
const { BadrequestError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const createCategory = async (req, res) => {
  const name = req.body.name.toLowerCase();
  const categoryExist = await Category.findOne({ name });
  if (categoryExist) throw new BadrequestError("category is already available");

  const category = await Category.create({ name });
  if (!category) throw new BadrequestError("failed to create category");
  res
    .status(StatusCodes.OK)
    .json({ message: "category created successfully", category });
};

const listCategory = async (req, res) => {
  const categories = await Category.find({});
  if (!categories) throw new BadrequestError("no category found");
  res.status(StatusCodes.OK).json({ categories });
};

const postsByCategories = async (req, res) => {
  const categoryName = req.params.name.toLowerCase();
  const category = await Category.findOne({ name: categoryName });
  if (!category) throw new BadrequestError("no category with that name");

  const posts =
    (await Post.find({ categories: category._id })
      .populate("categories")
      .populate("tags")
      .populate("postedBy", "_id, name, username")
      .select(
        "_id title body excerpt categories tags postedBy createdAt updatedAt"
      )) || [];
  res.status(StatusCodes.OK).json({ category: categoryName, posts });
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findByIdAndUpdate(id, {
    name: req.body.name,
  });
  if (!category) throw new BadrequestError("failed to update category");
  res.status(StatusCodes.OK).json({ message: "category updated successfully" });
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new BadrequestError("failed to delete category");
  res.status(StatusCodes.OK).json({ message: "category deleted successfully" });
};

module.exports = {
  createCategory,
  listCategory,
  postsByCategories,
  updateCategory,
  deleteCategory,
};
