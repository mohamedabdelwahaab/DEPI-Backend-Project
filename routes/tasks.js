const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  Task,
  validateCreateTask,
  validateUpdateTask,
} = require("../models/Task");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateTask(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    let newTask = new Task({
      workspace: req.body.workspace,
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
