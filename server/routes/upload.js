const express = require('express');
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

const router = express.Router();

// Upload single image
router.post('/image', auth, upload.single('image'), uploadController.uploadImage);

// Upload multiple images
router.post('/images', auth, upload.array('images', 5), uploadController.uploadMultipleImages);

// Delete image
router.delete('/image/:publicId', auth, uploadController.deleteImage);

module.exports = router;
