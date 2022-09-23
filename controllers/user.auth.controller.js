const User = require("../models/user.model");
const nodemail = require("nodemailer");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadrequestError } = require("../errors/index");
const {
  userToken,
  createToken,
  decodeToken,
  addTokenToCookie,
  createPreAndResetToken,
  decodePreAndResetToken,
} = require("../utils/index");

const preSignUp = async (req, res) => {
  const { name, username, email, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email }).select("email");
  if (emailAlreadyExists) {
    throw new BadrequestError("Email already taken");
  }

  const preToken = createPreAndResetToken({
    payload: { name, username, email, password },
  });

  const transporter = nodemail.createTransport({
    service: "gmail",
    secure: false, // use SSL
    port: 25, // port for secure SMTP
    auth: {
      user: process.env.mail,
      pass: process.env.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.mail,
    to: email,
    subject: `Account activation link`,
    html: `
    <p>Please use the link below to activate your account</p>
    <p>${process.env.CLIENT_URL}/auth/account/activate/${preToken}</p>
    <hr />
    <p>This email may contain sensitive information</p>
    <p>https://dyblog.com</p>
   `,
  };

  transporter.sendMail(mailOptions, (err, mailInfo) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.OK).json({ message: "mail sent successfully" });
  });
};

const signup = async (req, res) => {
  const regToken = req.body.token;
  if (!regToken) {
    throw new BadrequestError("no registration token found");
  }

  const regBody = decodePreAndResetToken(regToken);
  if (!regBody) {
    throw new BadrequestError("expired registration token");
  }

  const isFirstUser = (await User.countDocuments({})) === 0;
  const userRole = isFirstUser ? "admin" : "user";
  regBody.role = userRole;

  const { name, email, username, password, role } = regBody;
  const user = await User.create({ name, email, username, password });
  const tokenForUser = userToken(user);
  //const userToken = createToken({ payload: tokenForUser });
  addTokenToCookie({ res, user: tokenForUser });
  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadrequestError("provide login details");
  }

  const user = await User.findOne({ email }).select("username name");

  if (!user) {
    throw new NotFoundError("user not found. please register as a new user");
  }
  const verifyPassword = await user.comparePasswords(password);
  if (!verifyPassword) {
    throw new BadrequestError("invalid password");
  }
  const userToken = userToken(user);
  //const token = createToken({ payload: userToken });
  addTokenToCookie({ res, user: userToken });
  res.status(StatusCodes.OK).json({ msg: "login successful" });
};

const logout = (req, res) => {
  res.cookie("token", "log out user", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ message: "user logged out" });
  //res.clearCookie("token");
};

module.exports = { preSignUp, signup, login };
