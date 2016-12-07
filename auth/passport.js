var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/darsuser');

/**
 * Specifies what strategy we'll use
 */
module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    // username is netid
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'netid',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, netid, password, done) {
            User.findOne({'netid': netid}, function (err, user) {
                if (err) {
                    return done(err);
                } else if (user) {
                    return done(null, false);
                } else {
                    var newUser = new User();

                    newUser.netid = netid;
                    newUser.name = req.body.name;
                    newUser.password = newUser.generateHash(password);
                    newUser.graduationDate = req.body.graduationDate;
                    newUser.classTaken = [];
                    newUser.classInProgress = [];
                    newUser.classRegistered = [];

                    console.log("begin to save user to DB");
                    newUser.save(function (err) {
                        console.log("Oops, some err in saving!");
                        return done(null, newUser);
                        //return done(null, false); attempt to fix failure when failing to save to DB
                    });
                }

            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'netid',
            passwordField: 'password'
        },
        function (netid, password, done) {
            User.findOne({'netid': netid}, function (err, user) {
                if (err) {
                    return done(err);
                } else if (!user || !user.validPassword(password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }));
};