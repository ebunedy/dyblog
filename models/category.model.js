const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const categorySchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "please provide category"],
      maxLength: 35,
    },
  },
  { timestamp: true }
);

module.exports = model("Category", categorySchema);
