const router = require("express").Router();
const {
  createCategory,
  updateCategory,
  listCategory,
  postsByCategories,
  deleteCategory,
} = require("../controllers/category.controller");

router.post("/create", createCategory).post("/update", updateCategory);
router.get("/categories", listCategory).get("/:category", postsByCategories);
router.delete("/delete/:category", deleteCategory);

module.exports = router;
