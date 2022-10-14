const router = require("express").Router();
const {
  createTag,
  updateTag,
  listTags,
  postsByTags,
  deleteTag,
} = require("../controllers/tag.controller");

router.post("/create", createTag).patch("/update/:tagId", updateTag);
router.get("/tags", listTags).get("tags/:tagName", postsByTags);
router.delete("/delete/:tagId", deleteTag);

module.exports = router;
