const mongoose = require('mongoose');
const { isEmail } = require('validator');
const ApiError = require('../lib/ApiError');

const commentSchema = new mongoose.Schema({


  comment: {
    type: String,
    required: [true, 'Comment is required'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: [true, "User id required"]
  },
  post: {
    type: mongoose.Types.ObjectId,
    required: [true, "Post id required"]
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
commentSchema.set('strict',true);


const CommentModel = mongoose.model("comment", commentSchema, "comments");

module.exports = CommentModel;
