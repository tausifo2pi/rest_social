const BaseDB = require("../base/BaseDB");
const LikeModel = require("../model/LikeModel");
const Paginate = require("./utils/Paginate");
const { sortStage, unsetStage, singleLookupStage, matchStage } = require("./utils/commonStage");



const paginate = new Paginate(LikeModel);


const resolveStage = (resolve) => {
    const stage = []
    if (resolve.user) {
        stage.push(...singleLookupStage("users", "user", "_id", "user", "user"))
        stage.push(...unsetStage(["user.__v", "user.password"]))
    }

    if (resolve.post) {
        stage.push(...singleLookupStage("posts", "post", "_id", "post", "post"))
        stage.push(...unsetStage(["post.__v", ]))
    }
    return stage
}

class LikeDB extends BaseDB {
    constructor() {
        super(LikeModel)
    }


    async read(filter = {}, resolve = {}, options = {}) {
        const stages = [
            ...matchStage(filter, ["_id", "user", "post"]),
            ...unsetStage(options.unset || ["__v"])
        ];
        const facetStages = {
            data: [
                ...sortStage(options.sortBy, options.sortOrder, options.limit, options.page),
                ...resolveStage(resolve)
            ]
        }
        const result = await paginate.exec(stages, facetStages, options);
        return result
    }


}

module.exports = new LikeDB()