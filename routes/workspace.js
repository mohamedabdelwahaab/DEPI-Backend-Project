const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  Workspace,
  validateCreateWorkspace,
  validateGetWorkspace,
} = require("../models/Workspace");
const { User } = require("../models/User");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateWorkspace(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    User.findById(req.body.user)
      .then(async () => {
        let newWorkspace = new Workspace({
          user: req.body.user,
          title: req.body.title,
          image: req.body.image,
        });

        const result = await newWorkspace.save();

        res.status(201).json(result);
      })
      .catch(() => {
        console.log(req.body.user);
        return res.status(400).json({ error: "no user with this id" });
      });
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateGetWorkspace(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = User.findById(req.body.user)
      .then(async () => {
        await Workspace.find({ user: req.body.user })
          .then(async () => {
            res
              .status(200)
              .json(await Workspace.find({ user: req.body.user }, ["_id"]));
          })
          .catch(() => {
            return res
              .status(400)
              .json({ error: "no workspace for this user" });
          });
      })
      .catch(() => {
        console.log(req.body.user);
        return res.status(400).json({ error: "no user with this id" });
      });
  })
);

module.exports = router;
