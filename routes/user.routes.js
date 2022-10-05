const router = require("express").Router();
const passport = require("passport");
const {
  publicProfile,
  imageUpload,
  preUserUpdate,
  userUpdate,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
} = require("../controllers/user.controller");

router
  .post("/image-upload", [passport.authenticate("session"), imageUpload])
  .post("/update", [passport.authenticate("session"), userUpdate])
  .post("/update-following", addFollowing)
  .post("/update-followers", addFollower)
  .post("/remove-following", removeFollowing)
  .post("/remove-follower", removeFollower);
router
  .get("/pre-update", preUserUpdate)
  .get("/profile/:username", publicProfile);

module.exports = router;
