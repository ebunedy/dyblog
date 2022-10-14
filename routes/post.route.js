const router = require("express").Router();
const passport = require("passport");
const {
  createPost,
  updatePost,
  allPosts,
  searchSortPaginatePosts,
  relatedPost,
  getSinglePost,
  prePostUpdate,
  deletePost,
} = require("../controllers/post.controller");

router.post("/create", createPost).patch("/update/:postId", updatePost);
router
  .get("/posts", allPosts)
  .get("pre-update", prePostUpdate)
  .get("search/:postId", searchSortPaginatePosts)
  .get("related-posts/:postId", relatedPost)
  .get("/:postId", getSinglePost);
router.delete("/delete/:postId", deletePost);

module.exports = router;
