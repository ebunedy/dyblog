const User = require("../models/user.model");
const nodemail = require("nodemailer");
const {
  createToken,
  createPreAndResetToken,
  decodePreAndResetToken,
} = require("../utils/index");

const preSignup = async (req, res) => {
  const { name, username, email, password } = req.body;
};
