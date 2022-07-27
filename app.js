const createError = require('http-errors');

const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('./models/user');

require('dotenv').config();

// set up connection with mongodb
mongoose.connect(process.env.mongodbURI, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "mongo connection error"));

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use(session({ secret: process.env.sessionSecret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: "Invalid Username" });
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Incorrect Password" });
                }
            })

        }) 
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
})

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/sign-up', (req, res) => {
    res.render('signup');
})

app.post(
    '/sign-up',
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
        res.redirect('/');
    }
);

app.get('/log-in', (req, res) => {
    res.render('login');
});

app.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login-failed"
    })
);

app.get('/login-failed', (req, res) => {
    res.render('loginFailed')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});  

app.listen(3000, () => console.log("app listening on port 3000!"));