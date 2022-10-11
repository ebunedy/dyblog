const router = require("express").Router();
const {
  createTag,
  updateTag,
  listTags,
  postsByTags,
} = require("../controllers/tag.controller");

router.post("/create", createTag).post("/update", updateTag);
router.get("/tags", listTags).get("/:tag", postsByTags);

module.exports = router;
