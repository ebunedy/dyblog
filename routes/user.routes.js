const router = require("express").Router();
const passport = require("passport");
const {
  publicProfile,
  imageUpload,
  preUserUpdate,
  userUpdate,
} = require("../controllers/user.controller");

router
  .post("/image-upload", imageUpload)
  .post("/update", passport.authenticate("session"), userUpdate);
router.get("/pre-update", preUserUpdate).get("/profile/:id", publicProfile);

module.exports = router;
