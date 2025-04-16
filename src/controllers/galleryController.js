const GalleryImage = require('../models/GalleryImage');
const Category = require('../models/Category');

// Get all gallery images with pagination and filters
exports.getGalleryImages = async (req, res) => {
    try {
        const { page = 1, limit = 10, categoryId, categoryName, search } = req.query;

        const query = {};

        if (categoryId) query.category = categoryId;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
            ];
        }

        if (categoryName) {
            const category = await Category.findOne({
                name: { $regex: categoryName, $options: 'i' }
            });
            if (category) query.category = category._id;
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: 'category'
        };

        // Always use paginate, even when no filters are applied
        const result = await GalleryImage.paginate(query, options);
        
        res.status(200).json({
            data: result.docs,
            pagination: {
                total: result.totalDocs,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        });
    } catch (err) {
        console.error('Error fetching gallery images:', err);
        res.status(500).json({ error: 'Failed to fetch gallery images' });
    }
};

// Get single gallery image
exports.getGalleryImage = async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id).populate('category');
        if (!image) {
            return res.status(404).json({ error: 'Gallery image not found' });
        }
        res.status(200).json({ data: image });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch gallery image' });
    }
};

// Create new gallery image
exports.createGalleryImage = async (req, res) => {
    try {
        const { title, url, categoryId } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Simple secret check (not a real token verification, just matching)
        if (token !== process.env.APP_SECRET) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        if (!title || !url || !categoryId) {
            return res.status(400).json({ error: 'Title, URL and category ID are required' });
        }

        // Verify category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const newImage = new GalleryImage({
            title,
            url,
            category: categoryId
        });

        const savedImage = await newImage.save();
        res.status(201).json({
            message: 'Gallery image created successfully',
            data: await savedImage.populate('category')
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create gallery image' });
    }
};

// Update gallery image
exports.updateGalleryImage = async (req, res) => {
    try {
        const { title, url, categoryId } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Simple secret check (not a real token verification, just matching)
        if (token !== process.env.APP_SECRET) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        const updateData = {};
        if (title) updateData.title = title;
        if (url) updateData.url = url;
        if (categoryId) {
            // Verify category exists
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            updateData.category = categoryId;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const updatedImage = await GalleryImage.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('category');

        if (!updatedImage) {
            return res.status(404).json({ error: 'Gallery image not found' });
        }

        res.status(200).json({
            message: 'Gallery image updated successfully',
            data: updatedImage
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update gallery image' });
    }
};

// Delete gallery image
exports.deleteGalleryImage = async (req, res) => {
    try {
        const deletedImage = await GalleryImage.findByIdAndDelete(req.params.id);
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Simple secret check (not a real token verification, just matching)
        if (token !== process.env.APP_SECRET) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        if (!deletedImage) {
            return res.status(404).json({ error: 'Gallery image not found' });
        }

        res.status(200).json({
            message: 'Gallery image deleted successfully',
            data: deletedImage
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete gallery image' });
    }
};