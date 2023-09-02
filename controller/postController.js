const postService = require("../service/postService")
const { paginationQueryParser, filterQueryParser } = require("../lib/queryParser");

class PostController {
    
    constructor(){
        this.service = postService
    }
    
    async create(req){
        const payload = req.body
        const result = await this.service.create(payload)
        return result
    }




    async read(req){
        
        const filter = filterQueryParser(req.query, ["_id", "title", "user"])

        const resolve = {
            user: req.query["get-user"] == "1",

            getComments: req.query["get-comments"] == "1",
            countComments: req.query["count-comments"] == "1",

            getLikes: req.query["get-likes"] == "1",
            countLikes: req.query["count-likes"] == "1"
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

            getComments: req.query["get-comments"] == "1",
            countComments: req.query["count-comments"] == "1",

            getLikes: req.query["get-likes"] == "1",
            countLikes: req.query["count-likes"] == "1"
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

module.exports = new PostController()