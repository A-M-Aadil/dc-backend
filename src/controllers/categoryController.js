const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ data: categories });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// Get single category
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ data: category });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

// Create new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Simple secret check (not a real token verification, just matching)
        if (token !== process.env.APP_SECRET) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }

        const newCategory = new Category({
            name,
            description,
            image,
        });

        const savedCategory = await newCategory.save();
        res.status(201).json({
            message: 'Category created successfully',
            data: savedCategory
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Simple secret check (not a real token verification, just matching)
        if (token !== process.env.APP_SECRET) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { image },
            { new: true, runValidators: true },
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Simple secret check (not a real token verification, just matching)
        if (token !== process.env.APP_SECRET) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category deleted successfully',
            data: deletedCategory
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};