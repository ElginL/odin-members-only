const { body, validationResult } = require('express-validator');
const User = require('../models/user');

const renderJoinAdmin = (req, res) => {
    res.render('adminJoin');
}

const joinAdmin = () => [
    body('password')
        .escape()
        .isLength({ min: 1 })
        .withMessage("Password cannot be empty")
        .custom(value => {
            if (value !== process.env.adminPw) {
                return Promise.reject('Password is invalid!');
            }

            return true;
        }),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('adminJoin', {
                errors: errors.array(),
            });

            return;
        }
        
        User.findOneAndUpdate({ username: req.user.username }, {
            isAdmin: true
        }).then(() => {
            res.redirect('/');
        });
    }
];

module.exports = {
    renderJoinAdmin,
    joinAdmin
}