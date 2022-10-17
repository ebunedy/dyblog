const User = require("../models/user.model");
const nodemail = require("nodemailer");
const { StatusCodes } = require("http-status-codes");
const passport = require("passport");
const { NotFoundError, BadrequestError } = require("../errors/index");
const {
  userToken,
  userResetPasswordToken,
  createPreAndResetToken,
  decodePreAndResetToken,
  createToken,
} = require("../utils/index");

/** for production */
const transporter = nodemail.createTransport({
  service: "gmail", // change to host: emailengine smtp
  secure: false, // use SSL. change to true or remvove in production
  port: 25, // port for secure SMTP
  auth: {
    user: process.env.mail,
    pass: process.env.pass,
  },
  tls: {
    rejectUnauthorized: false, // you can remove tls
  },
});

/** ethereal test */
/*const etherealTransporter = nodemail.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "stan45@ethereal.email",
    pass: "rPkA6RQcmDESuZTzas",
  },
});*/

const preSignUp = async (req, res) => {
  const { name, username, email, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email }).select("email");
  if (emailAlreadyExists) throw new BadrequestError("Email already taken");

  const preToken = createPreAndResetToken({
    payload: { name, username, email, password },
  });
  res.status(StatusCodes.OK).json({ token: preToken });
  /**
   * email capability. for production
   **/
  /*const mailOptions = {
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
    res
      .status(StatusCodes.OK)
      .json({
        message: `mail sent to ${email}. click the link to activate your accout`,
      });
  });*/
};

const userRegistration = async (req, res) => {
  /** the commmented code is for preregistration functionality */
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
  //req.body.role = userRole; // switch in production

  regBody.role = userRole; //preregistration functionality

  const user = await User.create(regBody);
  if (!user) throw new BadrequestError("failed to create user");
  res
    .status(StatusCodes.CREATED)
    .json({ message: "user created", name: user.name });
};

const userLogin = async (req, res, next) => {
  passport.authenticate("login", async (err, user) => {
    try {
      if (err || !user) {
        const error = new BadrequestError(
          "no user found please register as a user"
        );
        next(error);
      }
      req.login(user, async (error) => {
        if (error) return next(error);
        //const userInfoToken = userToken(user);
        //const token = createToken({ payload: userInfoToken });
        res.status(StatusCodes.OK).json({
          message: "user logged in successfully",
          //token,
        });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

const logout = (req, res) => {
  req.session.destroy();
  res.status(StatusCodes.OK).json({ message: "user logged out" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    throw new BadrequestError(
      `user with ${email} does not exist. please register`
    );
  const resetTokenInfo = userResetPasswordToken(user);
  const passwordResetToken = createPreAndResetToken({
    payload: resetTokenInfo,
  });

  /** for email. */
  /*const mailOptions = {
    from: process.env.mail,
    to: email,
    subject: `Password reset link`,
    html: `
    <p>Please use the link below to reset your password</p>
    <p>${process.env.CLIENT_URL}/auth/account/password/reset/${passwordResetToken}</p>
    <hr />
    <p>This email may contain sensitive information</p>
    <p>https://dyblog.com</p>
   `,
  };*/

  user.resetPasswordLink = passwordResetToken;
  await user.save();

  res.status(StatusCodes.OK).json({ token: passwordResetToken });

  /*
  transporter.sendMail(mailOptions, (err, mailInfo) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.OK).json({
      message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`,
    });
  });
  */
};

const changePassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    throw new BadrequestError("please enter new password");
  const decodedToken = decodePreAndResetToken(token);
  if (!decodedToken) throw new BadrequestError("expired token");
  const user = await User.findOne(decodedToken);
  if (!user) throw new BadrequestError("no user found. please as a user");

  user.resetPasswordLink = "";
  user.password = password;
  await user.save();
  res.json({ message: "password reset successfully. please login" });
};

module.exports = {
  preSignUp,
  userRegistration,
  userLogin,
  logout,
  forgotPassword,
  changePassword,
};

/**
 *
 */
