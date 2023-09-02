const BaseDB = require("../base/BaseDB");
const UserModel = require("../model/UserModel");
const Paginate = require("./utils/Paginate");
const { sortStage, unsetStage, matchStage, singleLookupStage, lookupStage } = require("./utils/commonStage");

const paginate = new Paginate(UserModel);

const resolveStage = (resolve) => {
    const stage = []
    if (resolve.getPosts) {
        stage.push(...lookupStage("posts", "_id", "user", "posts",))
        stage.push(...unsetStage(["posts.__v", "posts.user"]))
    }

    if (resolve.countPosts) {
        stage.push(...lookupStage("posts", "_id", "user", "__posts",))
        stage.push({ $set: { countPosts: { $size: "$__posts" } } }),
            stage.push(...unsetStage(["__posts"]))
    }

    if (resolve.getComments) {
        stage.push(...lookupStage("comments", "_id", "user", "comments",))
        stage.push(...unsetStage(["comments.__v", "comments.user"]))
    }


    if (resolve.countComments) {
        stage.push(...lookupStage("comments", "_id", "user", "__comments",))
        stage.push({ $set: { countComments: { $size: "$__comments" } } }),
            stage.push(...unsetStage(["__comments"]))
    }

    if (resolve.getLikes) {
        stage.push(...lookupStage("likes", "_id", "user", "likes",))
        stage.push(...unsetStage(["likes.__v", "likes.user"]))
    }


    if (resolve.countLikes) {
        stage.push(...lookupStage("likes", "_id", "user", "__likes",))
        stage.push({ $set: { countLikes: { $size: "$__likes" } } }),
            stage.push(...unsetStage(["__likes"]))
    }

    return stage
}

const stageOrder = (resolve, options) => {
    const resolveSorting = ["countPosts", "countComments", "countLikes"]
    
    if (resolveSorting.includes(options.sortBy) && resolve[options.sortBy]) {
        return  [
                ...resolveStage(resolve),
                ...sortStage(options.sortBy, options.sortOrder, options.limit, options.page),
            ]
        

    }
    else {
        return [
            ...sortStage(options.sortBy, options.sortOrder, options.limit, options.page),
            ...resolveStage(resolve)
        ]
    }
}

class UserDB extends BaseDB {
    constructor() {
        super(UserModel)
    }


    async read(filter = {}, resolve = {}, options = {}) {
        const stages = [
            ...matchStage(filter, ["_id"], ["email"]),
            ...unsetStage(options.unset || ["__v"])
        ];
        const facetStages = {
            data: stageOrder(resolve, options)
        }
        const result = await paginate.exec(stages, facetStages, options);
        return result
    }





}

module.exports = new UserDB()