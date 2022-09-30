const User = require("../models/user.model");
const nodemail = require("nodemailer");
const { StatusCodes } = require("http-status-codes");
const passport = require("passport");
const { NotFoundError, BadrequestError } = require("../errors/index");
const {
  userToken,
  createPreAndResetToken,
  decodePreAndResetToken,
  createToken,
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

const userRegistration = async (req, res) => {
  /** the commmented code is for preregistration functionality */
  /*const regToken = req.body.token;
  if (!regToken) {
    throw new BadrequestError("no registration token found");
  }

  const regBody = decodePreAndResetToken(regToken);
  if (!regBody) {
    throw new BadrequestError("expired registration token");
  }*/
  const isFirstUser = (await User.countDocuments({})) === 0;
  const userRole = isFirstUser ? "admin" : "user";
  req.body.role = userRole;

  //regBody.role = userRole; //preregistration functionality

  const user = await User.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "user created", name: user.name });
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
        const userInfoToken = userToken(user);
        const token = createToken({ payload: userInfoToken });
        res.json({
          message: "user logged in successfully",
          token,
        });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

module.exports = { preSignUp, userRegistration, userLogin };
