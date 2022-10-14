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
  deleteUser,
} = require("../controllers/user.controller");

router
  .post("/image-upload", [passport.authenticate("session"), imageUpload])
  .patch("/update", [passport.authenticate("session"), userUpdate])
  .patch("/update-following", [passport.authenticate("session"), addFollowing])
  .patch("/update-followers", [passport.authenticate("session"), addFollower])
  .patch("/remove-following", [
    passport.authenticate("session"),
    removeFollowing,
  ])
  .patch("/remove-follower", [
    passport.authenticate("session"),
    removeFollower,
  ]);
router
  .get("/pre-update", [passport.authenticate("session"), preUserUpdate])
  .get("/profile/:username", publicProfile);
router.delete("delete/:username", deleteUser);

module.exports = router;
