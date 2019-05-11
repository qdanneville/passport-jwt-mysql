'use strict'

var config = require('../../config/main');
var jwt = require('jsonwebtoken');
var crypt = require('../helpers/crypt');
var db = require('../helpers/db');

module.exports = {
    authenticate,
    register,
    updateType,
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
        db.createUser(newUser, (res) => {
            return callback({ success: true, message: 'Successfully created new user.' });
        }, (err) => {
            return callback({ success: false, message: 'That email address already exists.' });
        });
    }
}

function authenticate({ email, password }, callback) {
    db.findUser({
        email: email
    }, (res) => {
        var user = {
            user_id: res.user_id,
            user_email: res.user_email,
            is_active: res.is_active,
            user_type: res.user_type
        };

        // Check if password matches
        crypt.compareHash(password, res.password, (err, isMatch) => {
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
    }, (err) => {
        return callback({ success: false, message: 'Authentication failed. User not found.' });
    });
}


function updateType(request, callback) {
    db.findUser({
        email: request.user.user_email
    }, (res) => {
        let updatedUser = {
            user_id: request.user.user_id,
            user_type: request.body.user_type
        }

        db.updateUserType(
            updatedUser
            , (res) => {
                return callback({ success: true, message: 'Successfully updated user.' });
            }, (err) => {
                return callback({ success: false, message: "Update failed. User type wasn't valid" });
            })
    }, (err) => {
        return callback({ success: false, message: 'Update failed. User not found.' });
    })
}
