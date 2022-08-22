require("dotenv").config();
require("../config/database").connect();
var moment = require('moment'); // require
const express = require("express");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Function 
const checkPasswordValidation = require('../helpers/validate_password');
const responseJson = require('../helpers/respons_json');


// importing user context
const User = require("../models/user");
const auth = require("../middleware/auth");
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
// Get Me
router.post("/users/me", auth, async (req, res) => {
  const user = await User.findById(req.user.user_id).lean();
  return responseJson(res, 201, true, 'สำเร็จ', user);

});

// Get User by id
router.get("/users/:id", auth, async (req, res) => {
  const user = await User.findOne({
    'user_id': req.params.id
  }).lean();
  return responseJson(res, 201, true, 'สำเร็จ', user);
});

// Get All User
router.get("/users", async (req, res) => {
  const user = await User.find();
  return responseJson(res, 201, true, 'สำเร็จ', user);

});


// Register
router.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const {
      email,
      password,
      username,
    } = req.body;

    // Validate user input
    if (!(email && password)) {
      return responseJson(res, 400, false, 'ข้อมูลไม่ถูกต้อง');
    }
    if (checkPasswordValidation(password)) {
      return responseJson(res, 400, false, checkPasswordValidation(password));
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({
      email
    });

    if (oldUser) {
      return responseJson(res, 409, false, 'มีบัญชีผู้ใช้แล้ว');
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create token

    // Create user in our database
    const user = await User.create({
      username: username,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      // token: token,
    });

    // Create token
    const token = jwt.sign({
        user_id: user._id,
        email
      },
      process.env.TOKEN_KEY, {
        expiresIn: "30d",
      }
    );
    // save user token

    user.user_id = user._id;
    user.token = token;

    await User.findByIdAndUpdate(user.user_id, {
      user_id: user._id,
      token: token,
      // token: token,
    });
    // return new user
    return responseJson(res, 201, true, 'สมัครสมาชิกสำเร็จ', user);

  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// Login
router.post("/login", async (req, res) => {

  // Our login logic starts herejffdfdfffdfffddfdffdffffdf
  try {
    // Get user inputf
    const {
      email,
      password
    } = req.body;

    // Validate user input
    if (!(email && password)) {
      // res.status(400).send("All input is required");
      return responseJson(res, 400, false, 'ข้อมูลไม่ถูกต้อง');
    }
    if (checkPasswordValidation(password)) {
      return responseJson(res, 400, false, checkPasswordValidation(password));
    }
    // Validate if user exist in our database
    const user = await User.findOne({
      email
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({
          user_id: user._id,
          email
        },
        process.env.TOKEN_KEY, {
          expiresIn: "30d",
        }
      );
      const date = new Date(Date());
      options.timeZone = 'UTC';
      // date.toLocaleDateString('th-TH', options)
      // save user token
      user.token = token;
      user.active_now = 'กำลังใช้งาน';
      user.active_status = true;
      await User.findByIdAndUpdate(user.user_id, {
        user_id: user._id,
        token: token,
        active_now:  'กำลังใช้งาน',
        active_status: true,
        // token: token,
      });

      // user
      return responseJson(res, 201, true, 'เข้าสู่ระบบสำเร็จ', user);
      // res.status(200).json(user);
    }

    return responseJson(res, 400, false, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');

  } catch (err) {
    console.log(err);
  }
});

// Logout
router.post("/logout", auth, async (req, res) => {
  
  moment.locale('th');
 const response = await User.findByIdAndUpdate(req.user.user_id, {
    token: null,
    active_now: null,
    active_status: false,
    last_active: moment(Date()).fromNow(),
  });
  if(!response){
    return responseJson(res, 201, false, 'ไม่พบบัญชีผู้ใช้');
  }
  return responseJson(res, 201, true, 'ออกจากระบบสำเร็จ');
});
// update user by id 

router.put("/update-user", auth, async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const {
      email,
      username,
    } = req.body;

    // Validate user input
    if (!(email && username)) {
      return responseJson(res, 400, false, 'ข้อมูลไม่ถูกต้อง');
    }

    await User.findByIdAndUpdate(req.user.user_id, {
      username: username,
      email: email,
      // token: token,
    });
    // return new user
    return responseJson(res, 201, true, 'อัปเดทสำเร็จ');

  } catch (err) {
    return responseJson(res, 404, false, 'อัปเดทล้มเหลว มี Email นี้ในระบบแล้ว');
  }
  // Our register logic ends here
});








module.exports = router;