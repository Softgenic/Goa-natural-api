const express = require("express");
const route = express.Router();

const path = require("path");
const db = require("../database/connection");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const { profile } = require("console");
var fs = require("fs");

const controller2 = require("../controller/usercontroller");
const protect = require("../middleware/verify");

route.post("/api/users", controller2.user);

route.post("/api/userlogin", controller2.loginAdmin);

route.get("/api/allUser", protect, controller2.getuser);
route.post("/api/addUser", (req, res, next) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 8);
  const number = req.body.number;
  const name = req.body.name;
  const address = "address 1";

  var sql = "INSERT INTO UserTable VALUES ?";
  const values = [[null, email, name, number, password, address]];
  console.log(values);
  db.query(sql, [values], (err, results, fields) => {
    if (err) {
      console.log(err);
    }
    {
      console.log("inserted", results);

      res.end();
    }
  });
});

route.post("/api/adduseraddress", controller2.useraddress);
route.get("/api/useraddress", controller2.getaddress);

module.exports = route;
