const mongoose = require("mongoose");

const { model, Schema } = mongoose;

const postModel = Schema({
  title: {
    type: String,
    required: [true, "please provide post title"],
    minLength: 5,
    maxLength: 200,
    trim: true,
  },
  body: {
    type: String,
    required: [true, "please provide the body of your post"],
    max: 2000000,
  },
  image: {
    type: String,
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  ],
  postedBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = model("Post", postModel);
