const userService = require("../service/userService")
const { paginationQueryParser, filterQueryParser } = require("../lib/queryParser");

class UserController {
    
    constructor(){
        this.service = userService
    }
    
    async create(req){
        const payload = req.body
        const result = await this.service.create(payload)
        return result
    }

    async login(req){
        const payload = req.body
        return this.service.login(payload)
    }

    async read(req){
        
        const filter = filterQueryParser(req.query, ["email",])
        let options = paginationQueryParser(req.query)

        options.unset = ["__v", "password"]

        const resolve = {
            getPosts: req.query["get-posts"] == "1",
            countPosts: req.query["count-posts"] == "1",

            getComments: req.query["get-comments"] == "1",
            countComments: req.query["count-comments"] == "1",

            getLikes: req.query["get-likes"] == "1",
            countLikes: req.query["count-likes"] == "1"
        }
        const result = await this.service.read(filter, resolve, options)
        return result
    }
    

    async readOne(req){

        const filter = filterQueryParser(req.query, ["_id"])
        let options = paginationQueryParser(req.query)
        options.unset = ["__v", "password"]

        const resolve = {
            getPosts: req.query["get-posts"] == "1",
            countPosts: req.query["count-posts"] == "1",

            getComments: req.query["get-comments"] == "1",
            countComments: req.query["count-comments"] == "1",

            getLikes: req.query["get-likes"] == "1",
            countLikes: req.query["count-likes"] == "1"
        }
        const result = await this.service.read(filter, resolve, options)
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

    async updatePassword(req){
        await this.service.updatePassword(req.query, req.body)
        return "success"
    }


    async delete(req){
        return  this.service.delete(req.query)
       
    }
}

module.exports = new UserController()