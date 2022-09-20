const router = require("express").Router();
const { preSignUp } = require("../controllers/user.auth.controller");

router.route("/pre-signup").post(preSignUp);

module.exports = router;
