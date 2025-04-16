const express = require('express');
const router = express.Router();
const {
  getGalleryImages,
  getGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} = require('../controllers/galleryController');

// GET all gallery images with pagination
router.get('/', getGalleryImages);

// GET single gallery image
router.get('/:id', getGalleryImage);

// POST create new gallery image
router.post('/', createGalleryImage);

// PUT update gallery image
router.put('/:id', updateGalleryImage);

// DELETE gallery image
router.delete('/:id', deleteGalleryImage);

module.exports = router;