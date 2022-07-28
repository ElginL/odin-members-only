const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Render page to join membership
router.get('/join', memberController.renderJoinMember);

// Join membership
router.post('/join', memberController.joinMember());

module.exports = router;