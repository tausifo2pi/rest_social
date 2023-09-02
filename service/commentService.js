const { default: isEmail } = require("validator/lib/isEmail");
const BaseService = require("../base/BaseService");
const commentDB = require("../database/commentDB");
const ApiError = require("../lib/ApiError");
const userService = require("./userService");
const postService = require("./postService");
const { convertObjectId, isObjectId, convertOrErrorObjectIds } = require("../database/utils/utils");
const { isObject } = require("../lib/isAnything");

class CommentService extends BaseService {

    constructor() {
        super(commentDB)
    }

    async create(body) {
        const errors = {}
        if(!isObject(body)) errors.message = "Invalid payload"
        
        if(Object.keys(errors).length) throw new ApiError(errors)
        const {objectIdErrors, objectIds} = convertOrErrorObjectIds(body, ["user", "post"])

        if(Object.keys(objectIdErrors).length) throw new ApiError(objectIdErrors)
        console.log(userService);

        const getUser = await userService.readOne({_id: objectIds.user})
        if(!getUser.res) throw new ApiError({user: "No user with given id"})

        const getPost = await postService.readOne({_id: objectIds.post})
        if(!getPost.res) throw new ApiError({post: "No post with given id"})
        const payload = {
            ...body,
            user: objectIds.user,
            post: objectIds.post,
        }
        return await this.db.create(payload)

    }


    async read(filter, resolve , options) {
        const result = await this.db.read(filter, resolve, options)
        return result
    }

    async update(query, body) {
        if ("_id" in body ) delete body._id
        if ("user" in body ) throw new ApiError("Updating user is not allowed")
        if ("post" in body ) throw new ApiError("Updating post is not allowed")
        let errors = {}
        if (!query?._id?.length && !isObjectId(query._id.length)) errors._id = "Invalid id"

        let result = await this.updateById(query, body, )
        
        if(!result) throw new ApiError("No documents matched", "Not Found", 404)

        return result

    }

    async delete(query) {


        if (!isObject(query) || !isObjectId(query._id) || !isObjectId(query.user)) throw new ApiError({ _id: "invalid id" })

        const getComment = await this.readOne({ _id: convertObjectId(query._id), user: convertObjectId(query.user) })
        if (!getComment.res) throw new ApiError({ message: "No content found" }, "Not Found", 404)

        try {
            await this.db.deleteOne({ _id: convertObjectId(query._id), user: convertObjectId(query.user) })
            return true
        } catch (error) {
            return false
        }
    }





}

module.exports = new CommentService()
