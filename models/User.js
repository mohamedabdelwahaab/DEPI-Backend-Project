const mongoose = require('mongoose');
const Joi = require('joi');
const userSchema = new mongoose.Schema(
    {
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
        isAdmin: {
            type: Boolean,
            default: false,
        }
    }
)
const User = mongoose.model('User', userSchema);

function validateRegisterUser(obj) {
    let schema = Joi.object({
        email: Joi.string().email().trim().required().min(5).max(200),
        password: Joi.string().min(5).max(200).required().trim(),
        isAdmin: Joi.boolean(),
        username: Joi.string().trim().min(3).max(200).required(),
    })
    return schema.validate(obj);
}

function validateLoginUser(obj) {
    let schema = Joi.object({
        email: Joi.string().email().trim().required().min(5).max(200),
        password: Joi.string().min(5).max(200).required().trim(),
    })
    return schema.validate(obj);
}

module.exports = {User,
    validateRegisterUser,
    validateLoginUser
};
