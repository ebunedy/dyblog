const express = require("express");
const app = express();
const passport = require("passport");
require("dotenv").config();
const session = require("express-session");
const sessionStore = require("./db/mongo-store");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ useTempFiles: true }));

app.use(
  session({
    secret: "test session",
    resave: false,
    //rolling: true,
    saveUninitialized: true, //use false for login session
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  })
);

require("./auth/auth");
app.use(passport.initialize());
app.use(passport.session());

/** application routes */
const authRouter = require("./routes/auth.user.route");

app.get("/", (req, res) => {
  console.log(req.session.cookie);
  res.send(`welcome to dyblog ${req.session.cookie}`);
});

app.use("/api/v1/user-auth", authRouter);

module.exports = app;
