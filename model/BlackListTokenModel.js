const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({


  token: {
    type: String,
    required: [true, 'token is required'],
  },


}, );


const TokenModel = mongoose.model("blackList", tokenSchema, "blackListTokens");

module.exports = TokenModel;
