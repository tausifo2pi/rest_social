const { default: isEmail } = require("validator/lib/isEmail");
const BaseService = require("../base/BaseService");
const userDB = require("../database/userDB");
const { convertToHash, compareHash } = require("../lib/hash");
const { isObject } = require("../lib/isAnything");
const { generateToken } = require("../lib/token");
const ApiError = require("../lib/ApiError");
const path = require("path")
const { rootDirectory } = require("../directory");
const { default: mongoose } = require("mongoose");



const { convertObjectId, isObjectId } = require("../database/utils/utils");


class UserService extends BaseService {

    constructor() {
        super(userDB)
    }

    async create(input) {
        if (!("password" in input) || input.password.length < 5) throw new ApiError({ password: "Password required" })
        const userObj = {
            ...input,
            password: await convertToHash(input.password)

        }

        const result = await this.db.create(userObj)
        if ("password" in result) result.password = undefined
        return result
    }


    async read(filter, resolve, options) {
        const result = await this.db.read(filter, resolve, options)
        return result
    }


    async login(input) {
        let error = {}

        if (!input.email || !isEmail(input.email)) error.email = "invalid email"
        if (!input.password) error.password = "invalid password"

        //checking error object
        if (Object.keys(error).length) throw new ApiError(error)

        const user = await this.db.readOne({ email: input.email.trim() })

        if (!user) {
            error.email = "no user with given email"
            throw new ApiError(error, "Unauthenticated", 401)
        }
        const matchedPass = await compareHash(input.password, user.password)

        if (!matchedPass) {
            error.login = "invalid email or password"
            throw new ApiError(error, "Unauthenticated", 401)
        }

        const userPayload = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }

        return await generateToken(userPayload, process.env.JWT_SECRET)

    }

    async update(query, body) {
        if ("password" in body) delete body.password
        if ("_id" in body) delete body._id
        let errors = {}
        if (!query?._id?.length && !isValidObjectId(query._id.length)) errors._id = "invalid id"


        let result = await this.updateById(query, body, ["password"])

        if (!result) throw new ApiError("No documents matched", "Not Found", 404)

        return result
    }

    async updatePassword(query, payload) {
        const error = {}
        if (!query._id) error._id = "invalid id"

        if (!payload.password) error.password = "invalid password"
        if (!payload.oldPassword) error.oldPassword = "invalid old password"

        if (Object.keys(error).length) throw new ApiError(error)

        const user = await this.db.readOne(query)

        if (!user) error.user = "no entry found"

        const { password } = user
        const isSameHash = await compareHash(payload.oldPassword, password)

        if (isSameHash === false) throw new ApiError({ oldPassword: "wrong old password" })
        const newHashedPassword = await convertToHash(payload.password)

        await this.updateById(query, { password: newHashedPassword })

        return "success"
    }

    async delete(query) {

        const postService = require("./postService");
        const commentService = require("./commentService");
        const likeService = require("./likeService");

        if (!isObject(query) || !isObjectId(query._id)) throw new ApiError({ _id: "invalid id" })

        const getUser = await this.readOne({ _id: convertObjectId(query._id) })
        if (!getUser.res) throw new ApiError({ _id: "invalid id" })

        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            // Delete the user's likes
            await likeService.deleteMany({ user: [getUser.res._id] })

            // Delete the user's comments
            await commentService.deleteMany({ user: [getUser.res._id] })

            // Delete the user's posts
            await postService.deleteMany({ user: [getUser.res._id] })

            // Delete the user
            await this.deleteOneById(getUser.res._id)


            // Commit the transaction
            await session.commitTransaction();
            console.log("all good");
            return true

        } catch (error) {
            // If an error occurred, abort the transaction
            await session.abortTransaction();
            console.error('Transaction aborted:', error);
            return false
        } finally {
            console.log("f");
            session.endSession();
            return true
        }
    }


}

module.exports = new UserService()
// [
//     {
//         "membersName": "opi",
//         "membersAge": "20",
//         "membersOccupation": "Civil Engineer"
//     },
//     {
//         "membersName": "X",
//         "membersAge": "20",
//         "membersOccupation": "Plumber"
//     },
//     {
//         "membersName": "Y",
//         "membersAge": "20",
//         "membersOccupation": "Bekar"
//     }

// ]