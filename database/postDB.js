const BaseDB = require("../base/BaseDB");
const PostModel = require("../model/PostModel");
const Paginate = require("./utils/Paginate");
const { sortStage, unsetStage, singleLookupStage, matchStage, lookupStage } = require("./utils/commonStage");

const paginate = new Paginate(PostModel);

const resolveStage = (resolve) => {
    const stage = []
    if (resolve.user) {
        stage.push(...singleLookupStage("users", "user", "_id", "user", "user"))
        stage.push(...unsetStage(["user.__v", "user.password"]))
    }

    if (resolve.getComments) {
        stage.push(...lookupStage("comments", "_id", "post", "comments",))
        stage.push(...unsetStage(["comments.__v", "comments.user"]))
    }


    if (resolve.countComments) {
        stage.push(...lookupStage("comments", "_id", "post", "__comments",))
        stage.push({ $set: { countComments: { $size: "$__comments" } } }),
        stage.push(...unsetStage(["__comments"]))
    }

    if (resolve.getLikes) {
        stage.push(...lookupStage("likes", "_id", "post", "likes",))
        stage.push(...unsetStage(["likes.__v", "likes.user"]))
    }


    if (resolve.countLikes) {
        stage.push(...lookupStage("likes", "_id", "post", "__likes",))
        stage.push({ $set: { countLikes: { $size: "$__likes" } } }),
            stage.push(...unsetStage(["__likes"]))
    }
    return stage
}


const stageOrder = (resolve, options) => {
    const resolveSorting = ["countComments", "countLikes"]

    if (resolveSorting.includes(options.sortBy) && resolve[options.sortBy]) {
        return [
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



class PostDB extends BaseDB {
    constructor() {
        super(PostModel)
    }

    async read(filter = {}, resolve = {}, options = {}) {
        const stages = [
            ...matchStage(filter, ["_id", "user"], ["title", "description"]),
            ...unsetStage(options.unset || ["__v"])
        ];
        const facetStages = {
            data: stageOrder(resolve, options)
        }
        const result = await paginate.exec(stages, facetStages, options);
        return result
    }


}

module.exports = new PostDB()