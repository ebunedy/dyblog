const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { model, Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const userModel = new Schema(
  {
    id: ObjectId,
    name: {
      type: String,
      required: [true, "please provide name"],
      minLength: 3,
      maxLength: 32,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "please provide username"],
      minLength: 3,
      maxLength: 25,
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
    password: {
      type: String,
      minLength: 8,
      required: [true, "please provide password"],
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    followers: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
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
    photo: {
      type: String,
    },
    role: {
      type: String,
      required: [true, "please provide a role"],
      enum: ["admin", "user"],
      default: "user",
    },
  },

  { timestamp: true }
);

userModel.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/** compare password  */
userModel.methods.comparePasswords = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

module.exports = model("User", userModel);
