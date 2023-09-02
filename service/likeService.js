const { default: isEmail } = require("validator/lib/isEmail");
const BaseService = require("../base/BaseService");
const likeDB = require("../database/likeDB");
const ApiError = require("../lib/ApiError");
const userService = require("./userService");
const postService = require("./postService");
const { convertObjectId, isObjectId, convertOrErrorObjectIds } = require("../database/utils/utils");
const { isObject } = require("../lib/isAnything");


class LikeService extends BaseService {

    constructor() {
        super(likeDB)
    }

    async create(body) {
        const errors = {}
        if(!isObject(body)) errors.message = "Invalid payload"
        
        if(Object.keys(errors).length) throw new ApiError(errors)
        const {objectIdErrors, objectIds} = convertOrErrorObjectIds(body, ["user", "post"])

        if(Object.keys(objectIdErrors).length) throw new ApiError(objectIdErrors)

        const getLikes = await this.readOne({user: objectIds.user, post: objectIds.post})
        if(getLikes.res) throw new ApiError({like: "Already like created for this post and user"})

        const getUser = await userService.readOne({_id: objectIds.user})
        if(!getUser.res) throw new ApiError({user: "No user with given id"})


        const getPost = await postService.readOne({_id: objectIds.post})
        if(!getPost.res) throw new ApiError({post: "No post with given id"})

        
        if(getPost.res?.user?.toString() === getUser.res?._id?.toString()) throw new ApiError({user: "Users are not allow to like own post"}, "Forbidden", 403)

        
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

    async delete(query) {

        if (!isObject(query) || !isObjectId(query._id) || !isObjectId(query.user)) throw new ApiError({ _id: "Invalid id" })

        const getLike = await this.readOne({ _id: convertObjectId(query._id), user: convertObjectId(query.user) })
        if (!getLike.res) throw new ApiError({ message: "No content found" }, "Not Found", 404)

        try {
            await this.db.deleteOne({ _id: convertObjectId(query._id), user: convertObjectId(query.user) })
            return true
        } catch (error) {
            return false
        }
    }



}

module.exports = new LikeService()

