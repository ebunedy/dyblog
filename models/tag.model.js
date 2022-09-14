const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const tagsModel = Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "please provide tag name"],
    maxLength: 35,
  },
});
