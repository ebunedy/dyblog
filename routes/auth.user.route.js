const router = require("express").Router();
const {
  preSignUp,
  signup,
  login,
} = require("../controllers/user.auth.controller");

router
  .post("/signup", preSignUp)
  .post("/register", signup)
  .post("/login", login);

module.exports = router;
