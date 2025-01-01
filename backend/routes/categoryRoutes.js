const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const authMiddleware = require("../middleware/authMiddleware");


router.post(
    "/categories",
    authMiddleware.protect,
    categoryController.createCategory
);


router.get(
    "/categories/:categoryId",
    authMiddleware.protect,
    categoryController.getCategoryById
);


router.get(
    "/categories/serviceProvider/:serviceProviderId",
    authMiddleware.protect,
    categoryController.getCategoriesByServiceProvider
);


router.get(
    "/categories",
    authMiddleware.protect,
    categoryController.getAllCategories
);


router.put(
    "/categories/:categoryId",
    authMiddleware.protect,
    categoryController.updateCategory
);


router.delete(
    "/categories/:categoryId",
    authMiddleware.protect,
    categoryController.deleteCategory
);

module.exports = router;
