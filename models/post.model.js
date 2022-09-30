const mongoose = require("mongoose");

const { model, Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const postModel = Schema(
  {
    id: ObjectId,
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
    excerpt: {
      type: String,
      max: 1000,
    },
    averageRating: {
      type: Number,
      default: 0,
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
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

postModel.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

postModel.post("remove", async function () {
  await this.model("Comment").deleteMany({ post: this._id });
});

module.exports = model("Post", postModel);
