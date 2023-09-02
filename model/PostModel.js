const mongoose = require('mongoose');
const { isEmail } = require('validator');
const ApiError = require('../lib/ApiError');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [5, 'Description should be at least 6 characters long'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: [true, "User id required"]
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
postSchema.set('strict',true);


const PostModel = mongoose.model("post", postSchema, "posts");

module.exports = PostModel;
