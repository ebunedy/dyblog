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
  addLike,
  removeLike,
} = require("../controllers/post.controller");

router
  .post("/create", createPost)
  .patch("/update/:postId", updatePost)
  .patch("/add-like/:postId", addLike)
  .patch("/remove-like/:postId", removeLike);
router
  .get("/posts", allPosts)
  .get("/pre-update/:postId", prePostUpdate)
  .get("/related-posts/:postId", relatedPost)
  .get("/search", searchSortPaginatePosts)
  .get("/:postId", getSinglePost);
router.delete("/delete/:postId", deletePost);

module.exports = router;
