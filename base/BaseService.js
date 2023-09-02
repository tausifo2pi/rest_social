const { isObjectId, convertObjectId } = require("../database/utils/utils")
const ApiError = require("../lib/ApiError")
const { isObject } = require("../lib/isAnything")

class BaseService {
    constructor(db) {
        this.db = db
    }

    async create(input) {
        return await this.db.insert(input)
    }

    async updateById(query, payload, exclude) {
        const filter = {}

        Object.keys(query).forEach(q => {
             if(isObjectId(query[q])) filter[q] = convertObjectId(query[q])
        })
        
        if(!(Object.keys(filter).length)) throw new ApiError({message: "can not update records without filter"})

        const request = await this.db.updateOne(filter, payload, exclude)
        
        return request

    }

    async readOne(query){
        try {
            return { err: null, res: await this.db.readOne(query) }
        } catch (err) {
            return {err, res: null}
        }
    }

    async deleteOneById(_id){
        if(!_id || !isObjectId(_id)) throw new ApiError({_id: "invalid id"})
        _id = convertObjectId(_id)
        
        return await this.db.deleteOne({_id})

    }

    async deleteMany(query){
        
        return await this.db.deleteMany(query)

    }
}
module.exports = BaseService
