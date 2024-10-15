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

    const user = await User.findById(req.body.id);

    if (!user) res.status(400).json({ error: "no user with this id" });

    let newWorkspace = new Workspace({
      user: req.body.id,
      title: req.body.title,
      image: req.body.image,
    });

    const result = await newWorkspace.save();

    await User.findByIdAndUpdate(req.body.id, {
      $set: {
        currentWorkspace: result._id,
      },
    });

    res.status(201).json(result);
  })
);

router.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.body.id);
    if (!user) return res.status(400).json({ error: "no user with this id" });
    const workspace = await Workspace.findById(user.currentWorkspace);
    if (!workspace)
      return res.status(400).json({ error: "no workspace with this id" });
    res.status(200).json(await Task.find({ workspace: workspace._id }));
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
    const user = await User.findById(req.body.id);
    if (!user) return res.status(400).json({ error: "no user with this id" });
    const workspace = await Workspace.findById(user.currentWorkspace);
    if (!workspace)
      return res.status(400).json({ error: "no workspace with this id" });
    res
      .status(200)
      .json(
        await Workspace.findById(user.currentWorkspace, [
          "_id",
          "title",
          "image",
        ])
      );
  })
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateWorkspace(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.findById(req.body.id);
    if (!user) return res.status(400).json({ error: "no user with this id" });
    const workspace = await Workspace.findById(user.currentWorkspace);
    if (!workspace)
      return res.status(400).json({ error: "no workspace with this id" });
    res.status(200).json(
      await Workspace.findByIdAndUpdate(user.currentWorkspace, {
        $set: {
          title: req.body.title,
          image: req.body.image,
        },
      })
    );
  })
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.body.id);
    if (!user) return res.status(400).json({ error: "no user with this id" });
    const workspace = await Workspace.findByIdAndDelete(user.currentWorkspace);
    if (!workspace)
      res.status(400).json({ error: "no workspace with this id" });
    const tasks = await Task.findById({ workspace: user.currentWorkspace });
    await Task.deleteMany({ workspace: user.currentWorkspace });
    res.status(201).json({ workspace, tasks });
  })
);

module.exports = router;
