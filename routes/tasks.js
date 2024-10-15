const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  Task,
  validateCreateTask,
  validateUpdateTask,
} = require("../models/Task");
const { Workspace } = require("../models/Workspace");
const { User } = require("../models/User");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateTask(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.findById(req.body.id);
    if (!user) return res.status(400).json({ error: "no user with this id" });
    const workspace = await Workspace.findById(user.currentWorkspace);

    if (!workspace)
      return res.status(400).json({ error: "no workspace with this id" });
    let newTask = new Task({
      workspace: user.currentWorkspace,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      created: req.body.created,
      duo: req.body.duo,
    });

    const result = await newTask.save();

    res.status(201).json(result);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.query.id);
    if (!task) return res.status(400).json({ error: "no task with this id" });
    res.status(200).json(await Task.findById(req.query.id));
  })
);

router.get(
  "/all",
  asyncHandler(async (req, res) => {
    res.status(200).json(await Task.find());
  })
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateTask(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const task = await Task.findByIdAndUpdate(req.query.id, {
      $set: {
        workspace: req.body.workspace,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        created: req.body.created,
        duo: req.body.duo,
      },
    });

    res.status(201).json(task);
  })
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.query.id);

    res.status(201).json(task);
  })
);
module.exports = router;
