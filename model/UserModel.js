const mongoose = require('mongoose');
const { isEmail } = require('validator');
const ApiError = require('../lib/ApiError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Invalid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password should be at least 6 characters long'],
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [2, 'First name should be at least 2 characters long'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [2, 'Last name should be at least 2 characters long'],
  },
  createdAt: {
    type: Date,
    required: [true, 'Invalid creation date']
  },
  updatedAt: {
    type: Date,
    required: [true, 'Invalid update date']
  }

}, );
userSchema.set('strict',true);


const UserModel = mongoose.model("user", userSchema, "users");

module.exports = UserModel;
