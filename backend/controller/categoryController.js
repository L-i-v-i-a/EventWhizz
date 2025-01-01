const categoryService = require('../services/categoryServices');

module.exports = {
    createCategory: async (req, res) => {
        try {
            const { name, serviceProvider } = req.body;

            if (!name || !serviceProvider) {
                return res.status(400).json({ error: "All required fields must be provided" });
            }

            const category = await categoryService.createCategory({ name, serviceProvider });

            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const { categoryId } = req.params;
            const category = await categoryService.getCategoryById(categoryId);

            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }

            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    getCategoriesByServiceProvider: async (req, res) => {
        try {
            const { serviceProviderId } = req.params;
            const categories = await categoryService.getCategoriesByServiceProvider(serviceProviderId);

            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { categoryId } = req.params;
            const updateData = req.body;

            const updatedCategory = await categoryService.updateCategory(categoryId, updateData);

            if (!updatedCategory) {
                return res.status(404).json({ error: "Category not found" });
            }

            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { categoryId } = req.params;
            await categoryService.deleteCategory(categoryId);

            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },
};
