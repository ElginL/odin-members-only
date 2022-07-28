const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Render create post page.
router.get('/create', postController.renderCreatePost);

// Create post
router.post('/create', postController.createPost());

module.exports = router;