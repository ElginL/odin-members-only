const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Render join admin page
router.get('/join', adminController.renderJoinAdmin);

// Upgrade account to admin.
router.post('/join', adminController.joinAdmin());

module.exports = router;