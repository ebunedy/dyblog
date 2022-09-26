const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const authRouter = require("./routes/auth.user.route");

app.get("/", (req, res) => {
  res.send("welcome to dyblog");
});

app.use("/api/v1/user-auth", authRouter);

module.exports = app;
