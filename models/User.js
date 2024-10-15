const mongoose = require("mongoose");
const Joi = require("joi");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 5,
    maxlength: 200,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  currentWorkspace: {
    type: String,
  },
});
const User = mongoose.model("User", userSchema);

function validateRegisterUser(obj) {
  let schema = Joi.object({
    email: Joi.string().email().trim().required().min(5).max(200),
    password: Joi.string().min(5).max(200).required().trim(),
    avatar: Joi.string().optional(),
    isAdmin: Joi.boolean(),
    username: Joi.string().trim().alphanum().min(3).max(200).required(),
    currentWorkspace: Joi.any(),
  });
  return schema.validate(obj);
}

function validateUpdateUser(obj) {
  let schema = Joi.object({
    id: Joi.any(),
    email: Joi.string().email().trim().optional().min(5).max(200),
    password: Joi.string().min(5).max(200).optional().trim(),
    avatar: Joi.string().optional().min(0),
    username: Joi.string().trim().min(3).max(200).optional(),
    currentWorkspace: Joi.string().optional(),
  });
  return schema.validate(obj);
}

function validateLoginUser(obj) {
  let schema = Joi.object({
    email: Joi.string().email().trim().required().min(5).max(200),
    password: Joi.string().min(5).max(200).required().trim(),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
