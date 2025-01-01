const { Category } = require('../model/categoryModel'); 

module.exports = {
    createCategory: async (categoryData) => {
        try {
            const newCategory = new Category(categoryData);
            const savedCategory = await newCategory.save();
            return savedCategory;
        } catch (error) {
            throw new Error("Error creating category: " + error.message);
        }
    },

    getCategoryById: async (categoryId) => {
        try {
            const category = await Category.findById(categoryId).populate('serviceProvider');
            if (!category) {
                throw new Error("Category not found");
            }
            return category;
        } catch (error) {
            throw new Error("Error fetching category by ID: " + error.message);
        }
    },

    getCategoriesByServiceProvider: async (serviceProviderId) => {
        try {
            const categories = await Category.find({ serviceProvider: serviceProviderId }).populate('serviceProvider');
            return categories;
        } catch (error) {
            throw new Error("Error fetching categories by service provider: " + error.message);
        }
    },

    getAllCategories: async () => {
        try {
            const categories = await Category.find().populate('serviceProvider');
            return categories;
        } catch (error) {
            throw new Error("Error fetching all categories: " + error.message);
        }
    },

    updateCategory: async (categoryId, updateData) => {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
            if (!updatedCategory) {
                throw new Error("Category not found");
            }
            return updatedCategory;
        } catch (error) {
            throw new Error("Error updating category: " + error.message);
        }
    },

    deleteCategory: async (categoryId) => {
        try {
            const deletedCategory = await Category.findByIdAndDelete(categoryId);
            if (!deletedCategory) {
                throw new Error("Category not found");
            }
            return deletedCategory;
        } catch (error) {
            throw new Error("Error deleting category: " + error.message);
        }
    },
};
