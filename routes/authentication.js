const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  validateRegisterUser,
  User,
  validateLoginUser,
} = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//register

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "This user already exists" });
    }

    let salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
    });

    const result = await newUser.save();
    let token = jwt.sign(
      { id: result._id, isAdmin: result.isAdmin },
      process.env.JWT_SECRET
    );

    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
  })
);

//login

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ error: "invalid email or password" });
    } else {
      const matchPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!matchPassword) {
        res.status(400).json({ error: "invalid email or password" });
      }
      const { password, ...other } = user._doc;
      let token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      res.status(200).json({ ...other, token });
    }
  })
);

module.exports = router;
