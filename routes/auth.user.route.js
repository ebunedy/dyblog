const router = require("express").Router();
const passport = require("passport");
const {
  preSignUp,
  userRegistration,
  userLogin,
  logout,
} = require("../controllers/user.auth.controller");

router
  .post("/pre-signup", preSignUp)
  .post("/register", userRegistration)
  .post("/login", userLogin);
router.get("/logout", logout);

module.exports = router;
