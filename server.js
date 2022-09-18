const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/", (req, res) => {
  const cookie = req.signedCookies.name;
  res.send(cookie);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
