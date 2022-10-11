const mongoose = require("mongoose");

const { model, Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const tagSchema = Schema(
  {
    id: ObjectId,
    name: {
      type: String,
      trim: true,
      required: [true, "please provide tag name"],
      maxLength: 35,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Tag", tagSchema);
