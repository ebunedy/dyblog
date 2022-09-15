const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser("secret"));

app.get("/", (req, res) => {
  const cookie = req.signedCookies.name;
  res.send(cookie);
});

app.get("/cookie", (req, res) => {
  res.cookie("name", req.params.name, {
    expires: new Date(Date.now() + 1000),
    signed: true,
  });
  res.send("cookie set");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
