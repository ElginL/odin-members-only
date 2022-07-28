const { body, validationResult } = require('express-validator');
const User = require('../models/user');

const renderJoinMember = (req, res) => {
    res.render('memberjoin');
}

const joinMember = () => [
    body('password')
    .escape()
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty")
    .custom(value => {
        if (value !== process.env.membershipPw) {
            return Promise.reject('Password is invalid!');
        }

        return true;
    }),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('memberJoin', {
                errors: errors.array(),
            });

            return;
        }
        
        User.findOneAndUpdate({ username: req.user.username }, {
            isMember: true
        }).then(() => {
            res.redirect('/');
        });
    }
]

module.exports = {
    renderJoinMember,
    joinMember
}