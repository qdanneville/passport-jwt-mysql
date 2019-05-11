"use strict";
var mysql = require("mysql");
var crypt = require("./crypt");
var config = require("../../config/main");
var db = {};
// Creating a connection object for connecting to mysql database
var connection = mysql.createConnection({
  host: config.database_host,
  user: config.database_user,
  password: config.database_password,
  database: config.database_name
});

//Connecting to database
connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

db.createUser = (user, successCallback, failureCallback) => {
  var passwordHash;
  crypt.createHash(user.password, (res) => {
    passwordHash = res;
    connection.query("INSERT INTO `passport-auth`.`users` (`user_email`, `password`) VALUES ('" + user.email + "', '" + passwordHash + "');"
      , function (err, rows, fields, res) {
        if (err) {
          failureCallback(err);
          return;
        }
        successCallback();
      }
    );
  },
    (err) => {
      failureCallback();
    }
  );
};

db.findUser = (user, successCallback, failureCallback) => {
  var sqlQuery =
    "SELECT * FROM `passport-auth`.users WHERE `user_email` = '" + user.email + "';";

  connection.query(sqlQuery, (err, rows, fields, res) => {
    if (err) {
      failureCallback(err);
      return;
    }
    if (rows.length > 0) {
      successCallback(rows[0]);
    } else {
      failureCallback("User not found.");
    }
  });
};

db.updateUserType = (user, successCallback, failureCallback) => {

  var sqlQuery = "UPDATE `users` SET `user_type`= " + user.user_type + " WHERE user_id = " + user.user_id;

  connection.query(sqlQuery, (err, row, fields, res) => {
    if (err) {
      failureCallback(err);
      return;
    }
    successCallback();
  })
}

module.exports = db;
