const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const tagSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "please provide tag name"],
      maxLength: 35,
    },
  },
  { timestamps: true }
);

module.exports = model("Tag", tagSchema);
