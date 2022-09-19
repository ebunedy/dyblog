const User = require("../models/user.model");
const nodemail = require("nodemailer");
const { NotFoundError, BadrequestError } = require("../errors/index");
const {
  createToken,
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
    auth: {
      user: process.env.mail,
      pass: process.env.pass,
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
    <p>https://domain.com</p>
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
