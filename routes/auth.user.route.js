const router = require("express").Router();
const passport = require("passport");
const {
  preSignUp,
  userRegistration,
  userLogin,
  forgotPassword,
  changePassword,
  logout,
} = require("../controllers/user.auth.controller");

router
  .post("/pre-signup", preSignUp)
  .post("/register", userRegistration)
  .post("/login", userLogin)
  .post("/reset-password", forgotPassword)
  .post("/change-password", changePassword);
router.get("/logout", logout);

module.exports = router;
