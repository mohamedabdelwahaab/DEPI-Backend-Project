const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { User, validateGetUser, validateUpdateUser } = require("../models/User");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateGetUser(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log(req.query.id);
    User.findById(req.query.id)
      .then(async () => {
        console.log(
          await User.findById(req.query.id, [
            "username",
            "email",
            "avatar",
            "-_id",
          ])
        );
        return res
          .status(200)
          .json(
            await User.findById(req.query.id, [
              "username",
              "email",
              "avatar",
              "-_id",
            ])
          );
      })
      .catch(() => {
        return res.status(400).json({ error: "invalid id" });
      });
  })
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log(req.query.id);
    User.findById(req.query.id)
      .then(async () => {
        console.log(
          await User.findByIdAndUpdate(req.query.id, {
            $set: {
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
              avatar: req.body.avatar,
            },
          })
        );
        return res
          .status(200)
          .json(
            await User.findById(req.query.id, [
              "username",
              "email",
              "avatar",
              "-_id",
            ])
          );
      })
      .catch(() => {
        return res.status(400).json({ error: "invalid id" });
      });
  })
);

module.exports = router;
