const likeService = require("../service/likeService")
const { paginationQueryParser, filterQueryParser } = require("../lib/queryParser");

class LikeController {
    
    constructor(){
        this.service = likeService
    }
    
    async create(req){
        const payload = req.body
        const result = await this.service.create(payload)
        return result
    }

    async read(req){
        
        const filter = filterQueryParser(req.query, ["_id", "user", "post"])

        const resolve = {
            user: req.query["get-user"] == "1",
            post: req.query["get-post"] == "1"
        }

        const options = paginationQueryParser(req.query)
        options.unset = ["__v"]

        const result = await this.service.read(filter, resolve, options)
        return result
    }
    

    async readOne(req){

        const filter = filterQueryParser(req.query, ["_id"])
        
        const resolve = {
            user: req.query["get-user"] == "1",
            post: req.query["get-post"] == "1"
        }

        const result = await this.service.read(filter, resolve, { unset: ["__v"] })
        if(result.data && result.data.length === 1){
            return result.data[0]
        }
        else {
            return null
        }
    }



    async delete(req){
        return  this.service.delete(req.query)
       
    }


}

module.exports = new LikeController()