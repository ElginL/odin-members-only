const passport = require('passport');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

const signUpUser = () => [
    body('fullname')
    .trim()
    .escape()
    .isLength({ min: 5, max: 30 })
    .withMessage("Length of full name must be between 5 and 30 characters")
    .custom(async value => {
        const user = await User.findOne({ fullname: value });
        if (user) {
            return Promise.reject('Full name is already in use');
        }
    }),
    body('username')
        .trim()
        .escape()
        .isLength({ min: 5, max: 20 })
        .withMessage("Length of username must be between 5 and 20 characters")
        .custom(async value => {
            const user = await User.findOne({ username: value });
            if (user) {
                return Promise.reject('Username is already in use');
            }
        }),
    body('password')
        .trim()
        .escape()
        .isLength({ min: 6 })
        .withMessage("Length of password must be at least 6 characters"),
    body('confirm-password')
        .trim()
        .escape()
        .isLength({ min: 6 })
        .withMessage("Length of confirm password must be at least 6 characters")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return Promise.reject('Password confirmation does not match password');
            }
            return true;
        }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('signup', {
                errors: errors.array(),
                fullname: req.body.fullname,
                username: req.body.username,
                password: req.body.password,
                confirmPassword: req.body['confirm-password']
            })

            return;
        }

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            new User({
                fullname: req.body.fullname,
                username: req.body.username,
                password: hashedPassword,
                isMember: false,
                isAdmin: false
            }).save(err => {
                if (err) {
                    return next(err);
                }
            });
        });
        res.redirect('/log-in');
    }
]

const logOutUser = (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
    })
    
    res.redirect('/');
}

const logInUser = () => [
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login-failed"
    }
)]

const renderSignUp = (req, res) => {
    res.render('signup');
}

const renderLogin = (req, res) => {
    res.render('login');
}

const renderFailedLogin = (req, res) => {
    res.render('loginFailed');
}

module.exports = {
    signUpUser,
    logOutUser,
    logInUser,
    renderSignUp,
    renderLogin,
    renderFailedLogin
}