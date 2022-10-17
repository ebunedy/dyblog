const router = require("express").Router();
const {
  createComment,
  deleteComment,
} = require("../controllers/comment.controller");

router.post("/create", createComment);
router.delete("delete/:postId", deleteComment);

module.exports = router;
