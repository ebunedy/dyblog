const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
