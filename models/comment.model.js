const mongoose = require("mongoose");

const { model, Schema } = mongoose;

const commentSchema = Schema(
  {
    comment: {
      type: String,
      required: [true, "please provide your comment"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
