const commentService = require("../service/commentService")
const { paginationQueryParser, filterQueryParser } = require("../lib/queryParser");

class CommentController {
    
    constructor(){
        this.service = commentService
    }
    
    async create(req){
        const payload = req.body
        const result = await this.service.create(payload)
        return result
    }




    async read(req){
        
        const filter = filterQueryParser(req.query, ["title", "user", "post", "_id"])

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


    async update(req){
        return  await this.service.update(req.query, req.body)
    }

    async delete(req){
        return  this.service.delete(req.query)
       
    }



}

module.exports = new CommentController()