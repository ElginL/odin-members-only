const createError = require('http-errors');

const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/user');
const Posts = require('./models/post');

const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const memberRoute = require('./routes/memberRoute');
const adminRoute = require('./routes/adminRoute');

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

app.get('/', (req, res, next) => {
    Posts.find()
        .populate('creator')
        .exec((err, results) => {
            if (err) {
                return next(err)
            }

            res.render('index', {
                posts: results
            })
        });
})

// Express Routers
app.use('/', authRoute);

// Allow only user who are authenticated to access the routers below.
app.use((req, res, next) => {
    if (!req.user) {
        return res.redirect('/log-in')
    }
    next();
})

app.use('/posts', postRoute);
app.use('/membership', memberRoute);
app.use('/admin', adminRoute);

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

app.listen(process.env.PORT || 3000, () => console.log("app listening on port 3000!"));