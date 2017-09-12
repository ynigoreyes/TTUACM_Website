var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
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
            if (!user) return done(null, false, req.flash('loginMessage', 'Invalid Username.'));
            if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Invalid Password.'));
            if (user.verified === false) return done(null, false, req.flash('loginMessage', 'Please confirm your email.'));
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
                    async.waterfall([

                        function(done) {
                            var token = crypto.createHmac('sha256', email).digest('hex');
                            newUser.local.confirmEmailToken = token;
                            done(err, token);
                        },

                        function(token, done) {
                            var smtpTransport = nodemailer.createTransport({
                                service: 'Gmail',
                                auth: {
                                    //TODO: Use OAuth2
                                    user: 'acmtexastech@gmail.com',
                                    pass: '***REMOVED***'
                                }
                            });
                            var mailOptions = {
                                to: email,
                                from: 'Texas Tech ACM',
                                subject: 'Confirm Account for TTU ACM',
                                text: 'You are receiving this because you (or someone else) have signed up for an account with Texas Tech Association of Computing Machinery.\n\n' +
                                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                    req.protocol + '://' + req.headers.host + '/confirm/' + token + '\n\n'
                            };
                            smtpTransport.sendMail(mailOptions, function(err) {
                                done(err);
                            });
                        }
                    ], function(err) {
                        if (err) return next(err);
                    });
                    newUser.local.firstName = req.body.firstName;
                    newUser.local.lastName = req.body.lastName;
                    newUser.local.email = email;
                    newUser.local.password = password;
                    newUser.local.classification = req.body.classification;
                    newUser.local.hasPaidDues = false;
                    newUser.local.verified = false;
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser, req.flash('loginMessage', 'We have sent an email to ' + email + ' to confirm your account.'));
                    });
                }
            });
        });
    }));
};
