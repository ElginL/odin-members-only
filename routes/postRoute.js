const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/post');

// Render create post page.
router.get('/create', (req, res) => {
    res.render('createPost');
});

// Create post
router.post(
    '/create',
    body('title')
        .trim()
        .escape()
        .isLength({ min: 5, max: 30 })
        .withMessage("Title must be between 5 and 30 characters"),
    body('content')
        .trim()
        .escape()
        .isLength({ min: 10, max: 60 })
        .withMessage("Content must be between 10 and 60 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('create', {
                errors: errors.array(),
                title: req.body.title,
                content: req.body.content
            })
            return;
        }

        const newPost = new Post({
            title: req.body.title,
            text: req.body.content,
            creator: req.user,
            emoji: req.body.feeling
        })

        newPost.save(err => {
            if (err) {
                return next(err);
            }

            res.redirect('/');
        })

    }
)

module.exports = router;