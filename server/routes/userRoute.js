const express = require("express");
const route = express.Router();

const path = require("path");
const db = require("../database/connection");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const { profile } = require("console");
var fs = require("fs");

const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "././config.env" });

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

  const verifyEmail = false;
  const verificationLink = uuidv4();

  var sql = "INSERT INTO UserTable VALUES ?";
  const values = [
    [
      null,
      email,
      name,
      number,
      password,
      address,
      verifyEmail,
      verificationLink,
    ],
  ];

  db.query(sql, [values], (err, results, fields) => {
    if (err) {
      console.log(err);
    }
    {
      console.log("inserted", results);

      try {
        //send mail
        let mailTransporter = nodemailer.createTransport({
          host: process.env.HOST,
          //   service: process.env.SERVICE,
          port: Number(process.env.EMAIL_PORT),
          security: process.env.SECURITY,
          pool: true,
          auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASS,
          },
        });
        let details = {
          from: process.env.USER_EMAIL,
          to: email,
          subject: "Verify email for goa natural account",
          text: `<a>http://localhost:3000/verifyEmail?email=${email}&verificationLink=${verificationLink} </a>`,
        };
        mailTransporter.sendMail(details, (err) => {
          if (err) {
            console.log("it has an error,err", err);
            res.end();
          } else {
            console.log("it has send");
            res.end();
          }
        });
      } catch (error) {
        console.log("email not sent!");
        console.log(error);
      }
      res.end();
    }
  });
});

route.post("/api/adduseraddress", controller2.useraddress);
route.get("/api/useraddress", controller2.getaddress);

module.exports = route;
