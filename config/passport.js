var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var async = require('async');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({'local.email': email}, function(err, user) {
            if (err) return done(err);
            if (!user || !user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Invalid credentials.'));
            return done(null, user);
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({'local.email': email}, function(err, user) {
                if (err) return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
                } else if (password !== req.body.confirmPassword) {
                    return done(null, false, req.flash('signupMessage', 'Password and confirm password must match.'))
                } else {
                    var newUser = new User();
                    newUser.local.firstName = req.body.firstName;
                    newUser.local.lastName = req.body.lastName;
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.classification = req.body.classification;
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};
