const BaseService = require("../base/BaseService");
const postDB = require("../database/postDB");
const ApiError = require("../lib/ApiError");
const userService = require("./userService");
const { convertObjectId, isObjectId, convertOrErrorObjectIds } = require("../database/utils/utils");
const { isObject } = require("../lib/isAnything");
const { default: mongoose } = require("mongoose");

class PostService extends BaseService {

    constructor() {
        super(postDB)
    }

    async create(body) {
        const errors = {}
        if (!isObject(body)) errors.message = "invalid payload"

        if (Object.keys(errors).length) throw new ApiError(errors)
        const { objectIdErrors, objectIds } = convertOrErrorObjectIds(body, ["user"])

        if (Object.keys(objectIdErrors).length) throw new ApiError(objectIdErrors)
        
        const getUSer = await userService.readOne({ _id: objectIds.user })

        if (getUSer.err) throw new ApiError({ user: "no user with given id" })

        const payload = {
            ...body,
            user: objectIds.user
        }
        return await this.db.create(payload)

    }


    async read(filter, resolve, options) {
        const result = await this.db.read(filter, resolve, options)
        return result
    }


    async update(query, body) {
        if ("_id" in body) delete body._id
        if ("user" in body) throw new ApiError("updating user is not allowed")
        let errors = {}
        if (!query?._id?.length && !isObjectId(query._id.length)) errors._id = "invalid id"

        let result = await this.updateById(query, body,)
        if (!result) throw new ApiError("No documents matched","Not Found", 404)
        return result

    }

    async delete(query) {

        //to avoid 
        const commentService = require("./commentService");
        const likeService = require("./likeService");

        if (!isObject(query) || !isObjectId(query._id) || !isObjectId(query.user)) throw new ApiError({ _id: "invalid id" })

        const getPost = await this.readOne({ _id: convertObjectId(query._id), user: convertObjectId(query.user) })
        if (!getPost.res) throw new ApiError({ _id: "invalid id" }, "Not Found", 404)

        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            // Delete the user's likes
            await likeService.deleteMany({ post: [getPost.res._id] })

            // Delete the user's comments
            await commentService.deleteMany({ post: [getPost.res._id] })

            // Delete the user's posts

            // Delete the user
            await this.deleteOneById(getPost.res._id)


            // Commit the transaction
            await session.commitTransaction();
            return true

        } catch (error) {
            // If an error occurred, abort the transaction
            await session.abortTransaction();
            console.error('Transaction aborted:', error);
            return false
        } finally {
            session.endSession();
            return true
        }
    }


}

module.exports = new PostService()
