const app = require("./app");
const cnonnectDb = require("./db/db.config");

cnonnectDb();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
