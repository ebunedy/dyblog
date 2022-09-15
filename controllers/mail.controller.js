const nodemail = require("nodemailer");
const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");

const transporter = nodemail.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

const sendBulkMail = async (req, res) => {
  const { subject, mbody, mtitle } = req.body;

  const mailOptions = {
    from: process.env.user,
    to: "to be retrieved from db later",
    subject: subject,
    html: `
       <h1>Welcome ${mtitle}</h1>
       <p>The ${mbody}</p>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.OK).json({ message: "mail sent successfully" });
  });
};

const sendSingleMail = async (req, res) => {
  const { subject, mbody, mtitle } = req.body;

  const mailOptions = {
    from: process.env.user,
    to: "to be retrieved from db later",
    subject: subject,
    html: `
      <h1>Welcome ${mtitle}</h1>
      <p>The ${mbody}</p>
   `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    res.status(StatusCodes.OK).json({ message: "mail sent successfully" });
  });
};

module.exports = { sendBulkMail, sendSingleMail };
