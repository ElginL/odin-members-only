const { body, validationResult } = require('express-validator');
const Post = require('../models/post');

const createPost = () => [
    body('title')
        .trim()
        .escape()
        .isLength({ min: 5, max: 30 })
        .withMessage("Title must be between 5 and 30 characters"),
    body('content')
        .trim()
        .escape()
        .isLength({ min: 10, max: 120 })
        .withMessage("Content must be between 10 and 120 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('createPost', {
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
}];

const renderCreatePost = (req, res) => {
    res.render('createPost');
}

const deletePost = (req, res, next) => {
    const id = req.params.id;

    if (req.user && req.user.isAdmin) {
        Post.findByIdAndDelete(id, (err, results) => {
            if (err) {
                return next(err);
            }

            res.redirect('/');
        })
    }
}

module.exports = {
    createPost,
    renderCreatePost,
    deletePost
}