'use strict'

var config = require('../../config/main');
var jwt = require('jsonwebtoken');
var crypt = require('../helpers/crypt');
var db = require('../helpers/db');

module.exports = {
    authenticate,
    register
};


function register(userParam, callback) {
    if (!userParam.email || !userParam.password) {
        return callback({ success: false, message: 'Please enter email and password.' });
    } else {
        var newUser = {
            email: userParam.email,
            password: userParam.password
        };

        // Attempt to save the user
        db.createUser(newUser, function (res) {
            return callback({ success: true, message: 'Successfully created new user.' });
        }, function (err) {
            return callback({ success: false, message: 'That email address already exists.' });
        });
    }
}

function authenticate({ email, password }, callback) {
    db.findUser({
        email: email
    }, function (res) {
        var user = {
            user_id: res.user_id,
            user_email: res.user_email,
            is_active: res.is_active,
            user_type: res.user_type
        };

        // Check if password matches
        crypt.compareHash(password, res.password, function (err, isMatch) {
            if (isMatch && !err) {
                // Create token if the password matched and no error was thrown
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 10080 // in seconds
                });
                return callback({ success: true, token: token });
            } else {
                return callback({
                    success: false,
                    message: 'Authentication failed. Passwords did not match.'
                });
            }
        });
    }, function (err) {
        return callback({ success: false, message: 'Authentication failed. User not found.' });
    });
}
