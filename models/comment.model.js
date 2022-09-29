const mongoose = require("mongoose");

const { model, Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const commentSchema = Schema(
  {
    id: ObjectId,
    comment: {
      type: String,
      required: [true, "please provide your comment"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
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

commentSchema.index({ user: 1, post: 1 }, { unique: true });

commentSchema.statics.averageRating = async function (postId) {
  const averageRating = await this.aggregate([
    { $match: { post: postId } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } },
  ]);

  try {
    await this.model("Post").findOneAndUpdate(
      { _id: postId },
      {
        averageRating: Math.ceil(averageRating[0]?.averageRating || 0),
      }
    );
  } catch (err) {
    console.error(err);
  }
};

commentSchema.post("save", async function () {
  await this.constructor.averageRating(this.post);
});

commentSchema.post("remove", async function () {
  await this.constructor.averageRating(this.post);
});

module.exports = model("Comment", commentSchema);
