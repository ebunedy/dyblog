const express = require("express");
const cnonnectDb = require("./db/db.config");
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

const PORT = 3000;
cnonnectDb();
app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});

module.exports = app;
