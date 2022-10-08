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
  .post("/update-following", [passport.authenticate("session"), addFollowing])
  .post("/update-followers", [passport.authenticate("session"), addFollower])
  .post("/remove-following", [
    passport.authenticate("session"),
    removeFollowing,
  ])
  .post("/remove-follower", [passport.authenticate("session"), removeFollower]);
router
  .get("/pre-update", [passport.authenticate("session"), preUserUpdate])
  .get("/profile/:username", publicProfile);

module.exports = router;
