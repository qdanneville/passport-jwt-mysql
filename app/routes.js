'use strict'
// Import dependencies
var passport = require('passport');
var express = require('express');
// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });

// Export the routes for our app to use
module.exports = function (app) {
    // API Route Section

    // Initialize passport for use
    app.use(passport.initialize());

    // Bring in defined Passport Strategy
    require('../config/passport')(passport);

    // Create API group routes
    var apiRoutes = express.Router();
    var userRoutes = require("./users/users.controller")

    //Protected authenticated route with JWT
    apiRoutes.get('/dashboard', requireAuth, function (request, response) {
        response.send('It worked User id is: ' + request.user.user_id + ', Email id is: ' + request.user.user_email + '.');
    });

    // Set url for API group routes
    app.use('/api', apiRoutes);
    app.use('/api/users', userRoutes);
};
