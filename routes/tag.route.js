const router = require("express").Router();
const {
  createTag,
  updateTag,
  listTags,
  postsByTags,
  deleteTag,
} = require("../controllers/tag.controller");

router.post("/create", createTag).post("/update", updateTag);
router.get("/tags", listTags).get("/:tag", postsByTags);
router.delete("/delete/:tag", deleteTag);

module.exports = router;
