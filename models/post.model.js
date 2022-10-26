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
      unique: true,
    },
    body: {
      type: String,
      required: [true, "please provide the body of your post"],
      maxLength: 2000000,
      minLength: 200,
    },
    excerpt: {
      type: String,
      required: true,
      maxLength: 400,
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      required: [true, "please provide a post state"],
      enum: ["draft", "published"],
      default: "draft",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/duakyn1ou/image/upload/v1664970087/file-upload/tmp-1-1664970085576.jpg",
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
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
