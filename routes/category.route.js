const router = require("express").Router();
const {
  createCategory,
  updateCategory,
  listCategory,
  postsByCategories,
  deleteCategory,
} = require("../controllers/category.controller");

router
  .post("/create", createCategory)
  .patch("/update/:categoryName", updateCategory);
router
  .get("/categories", listCategory)
  .get("categories/:categoryId", postsByCategories);
router.delete("/delete/:categoryId", deleteCategory);

module.exports = router;
