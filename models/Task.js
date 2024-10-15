const mongoose = require("mongoose");
const Joi = require("joi");
const taskSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Workspace",
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  status: {
    type: String,
    required: true,
    enum: ["completed", "pending", "in progress"],
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  duo: {
    type: Date,
    required: true,
  },
});
const Task = mongoose.model("Task", taskSchema);

function validateCreateTask(obj) {
  let schema = Joi.object({
    id: Joi.any(),
    workspace: Joi.string().optional(),
    title: Joi.string().trim().required().min(3).max(200),
    description: Joi.string().trim().required().min(3).max(200),
    status: Joi.string()
      .valid("completed", "pending", "in progress")
      .required(),
    created: Joi.date().optional(),
    duo: Joi.date().required(),
  });
  return schema.validate(obj, { abortEarly: false });
}

function validateUpdateTask(obj) {
  let schema = Joi.object({
    id: Joi.any(),
    title: Joi.string().trim().optional().min(3).max(200),
    description: Joi.string().trim().optional().min(3).max(200),
    status: Joi.string()
      .valid("completed", "pending", "in progress")
      .optional(),
    created: Joi.date().optional(),
    duo: Joi.date().optional(),
  });
  return schema.validate(obj, { abortEarly: false });
}

module.exports = { Task, validateCreateTask, validateUpdateTask };
