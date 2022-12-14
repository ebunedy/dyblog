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
const userRouter = require("./routes/user.routes");
const tagRouter = require("./routes/tag.route");
const postRouter = require("./routes/post.route");
const commentRouter = require("./routes/user.comment");

app.use("/api/v1/user-auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

app.get("/", (req, res) => {
  res.send(`welcome to dyblog ${req.session.cookie}`);
});

// Handle errors.
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
