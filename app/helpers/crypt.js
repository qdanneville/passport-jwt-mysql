'use strict';
var bcrypt = require('bcrypt-nodejs');

var crypt = {};

crypt.createHash = (data, successCallback, failureCallback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            failureCallback(err);
            return;
        }
        bcrypt.hash(data, salt, null, function (err, hash) {
            if (err) {
                failureCallback(err);
                return;
            }
            successCallback(hash);
        });
    });
};

crypt.compareHash = (data, encrypted, successCallback, failureCallback) => {
    bcrypt.compare(data, encrypted, (err, isMatch) => {
        if (err) {
            failureCallback(err);
            return;
        }
        successCallback(err, isMatch);
    });
};

module.exports = crypt;