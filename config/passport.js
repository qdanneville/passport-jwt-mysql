'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var db = require('../app/helpers/db');
var config = require('../config/main');

// Setup work and export for the JWT passport strategy
module.exports = (passport) => {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        secretOrKey: config.secret
    };

    passport.use(new JwtStrategy(opts, (jwt_payload, callback) => {
        db.findUser({ email: jwt_payload.user_email }, (res) => {
            var user = res;
            delete user.password;
            callback(null, user);
        }, (err) => {
            return callback(err, false);
        });
    }));
};
