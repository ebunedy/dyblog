const router = require("express").Router();
const { session } = require("passport");
const passport = require("passport");
const permission = require("../utils/permission");
const {
  createTag,
  updateTag,
  listTags,
  postsByTags,
  deleteTag,
} = require("../controllers/tag.controller");

router
  .post("/create", [/*passport.authenticate(session),*/ createTag])
  .patch("/update/:tagId", [/*passport.authenticate(session),*/ updateTag]);
router
  .get("/tags", [/*passport.authenticate(session),*/ listTags])
  .get("/:tagName", postsByTags);
router.delete("/delete/:tagId", [
  /*passport.authenticate(session),*/ deleteTag,
]);

module.exports = router;
