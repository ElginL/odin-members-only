const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render sign up screen
router.get('/sign-up', authController.renderSignUp);

// Sign up user
router.post('/sign-up', authController.signUpUser());

// Render login screen
router.get('/log-in', authController.renderLogin);

// Log in user
router.post("/log-in", authController.logInUser());

// Render login failed screen
router.get('/login-failed', authController.renderFailedLogin)

// Log out user
router.get('/log-out', authController.logOutUser);

module.exports = router;