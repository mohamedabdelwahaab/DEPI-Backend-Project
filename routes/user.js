const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { User, validateGetUser, validateUpdateUser } = require("../models/User");
const { Workspace } = require("../models/Workspace");
const { Task } = require("../models/Task");

router.get(
  "/workspaces",
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
    res.status(200).json(await User.find());
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateGetUser(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log(req.query.id);
    const user = await User.findById(req.query.id);
    if (!user) return res.status(400).json({ error: "no user with this  id" });
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
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log(req.query.id);
    const user = await User.findById(req.query.id);
    if (!user) return res.status(400).json({ error: "no user with this  id" });
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
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.query.id);
    if (!user) return res.status(400).json({ error: "no user with this id" });
    const workspaces = await Workspace.find({ user: req.query.id });
    const tasks = [];
    workspaces.map(async (workspace) => {
      tasks.push(await Task.find({ workspace: workspace._id }));
      await Task.deleteMany({ workspace: workspace._id });
    });
    await Workspace.deleteMany({ user: req.query.id });
    return res.status(200).json({ user, workspaces, tasks });
  })
);

module.exports = router;
