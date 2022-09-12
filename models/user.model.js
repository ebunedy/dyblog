const mongoose = require("mongoose");
const validator = require("validator");

const { model, Schema } = mongoose;

const userModel = Schema(
  {
    first_name: {
      type: String,
      required: [true, "please provide first name"],
      minLength: 3,
      max: 32,
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "please provide first name"],
      minLength: 3,
      max: 32,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "please provide username"],
      minLength: 3,
      max: 25,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please provide email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "please provide correct email",
      },
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    about: {
      type: String,
    },
    website: {
      type: String,
    },
    github: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
    roles: {
      type: String,
      required: [true, "please provide a role"],
      enum: ["admin", "user"],
      default: "user",
    },
  },

  { timestamp: true }
);

userModel.index({ following: 1, followers: 1 }, { unique: true });

module.exports = model("User", userModel);
