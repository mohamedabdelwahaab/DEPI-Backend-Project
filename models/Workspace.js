const mongoose = require("mongoose");
const Joi = require("joi");
const workSpaceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  image: {
    type: String,
    default: "default_workspace_image.jpg",
  },
});
const Workspace = mongoose.model("Workspace", workSpaceSchema);

function validateCreateWorkspace(obj) {
  let schema = Joi.object({
    title: Joi.string().trim().required().min(3).max(200),
    user: Joi.string().required(),
    image: Joi.string().optional(),
  });
  return schema.validate(obj);
}

function validateUpdateWorkspace(obj) {
  let schema = Joi.object({
    title: Joi.string().trim().optional().min(3).max(200),
    image: Joi.string().optional(),
  });
  return schema.validate(obj);
}

module.exports = {
  Workspace,
  validateCreateWorkspace,
  validateUpdateWorkspace,
};
