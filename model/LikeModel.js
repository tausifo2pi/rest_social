const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({

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
likeSchema.set('strict',true);


const LikeModel = mongoose.model("like", likeSchema, "likes");

module.exports = LikeModel;
