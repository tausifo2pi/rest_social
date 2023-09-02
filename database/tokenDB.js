const BaseDB = require("../base/BaseDB");
const TokenModel = require("../model/BlackListTokenModel");

class TokenDB extends BaseDB {
    constructor() {
        super(TokenModel)
    }




}

module.exports = new TokenDB()