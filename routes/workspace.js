const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  Workspace,
  validateCreateWorkspace,
  validateUpdateWorkspace,
} = require("../models/Workspace");
const { User } = require("../models/User");
const { Task } = require("../models/Task");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateWorkspace(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findById(req.body.user);

    if (!user) res.status(400).json({ error: "no user with this id" });

    let newWorkspace = new Workspace({
      user: req.body.user,
      title: req.body.title,
      image: req.body.image,
    });

    const result = await newWorkspace.save();

    res.status(201).json(result);
  })
);

router.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.query.id);
    if (!user) return res.status(400).json({ error: "no user with this id" });
    const workspace = await Workspace.find({ user: req.query.id });
    if (!workspace)
      return res.status(400).json({ error: "no workspace for this user" });
    res
      .status(200)
      .json(
        await Workspace.find({ user: req.query.id }, ["_id", "title", "image"])
      );
  })
);

router.get(
  "/all",
  asyncHandler(async (req, res) => {
    res.status(200).json(await Workspace.find());
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const workspace = await Workspace.findById(req.query.id);
    if (!workspace)
      return res.status(400).json({ error: "no workspace with this id" });
    res
      .status(200)
      .json(await Workspace.findById(req.query.id, ["_id", "title", "image"]));
  })
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateWorkspace(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const workspace = await Workspace.findById(req.query.id);
    if (!workspace)
      return res.status(400).json({ error: "no workspace with this id" });
    res.status(200).json(
      await Workspace.findOneAndUpdate(
        { user: req.query.id },
        {
          $set: {
            title: req.body.title,
            image: req.body.image,
          },
        }
      )
    );
  })
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const workspace = await Workspace.findByIdAndDelete(req.query.id);
    if (!workspace)
      res.status(400).json({ error: "no workspace with this id" });
    const tasks = await Task.find({ workspace: req.query.id });
    await Task.deleteMany({ workspace: req.query.id });
    res.status(201).json({ workspace, tasks });
  })
);

module.exports = router;
