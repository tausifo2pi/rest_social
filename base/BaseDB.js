const { convertObjectId } = require("../database/utils/utils")
const { isObject } = require("../lib/isAnything")

class BaseDB {
    constructor(Model){
        this.model = Model
    }

    async create(payload){
        return await this.model.create(payload,)
    }


    async updateOne(query, payload, exclude=[]){
        exclude = [...exclude, "__v"]

        let options = { new: true, lean: true, select: exclude.map(e => `-${e}`).join(" ")};
        
        return await this.model.findOneAndUpdate(query, payload,options )
        
        
    }
    async readOne(query = {}){
        return await this.model.findOne(query)
    }

    async deleteOne(query = {}){
        return await this.model.deleteOne(query)
    }


    //this delete many accept query be object. property id of array
    async deleteMany(query = {}){
        Object.keys(query).forEach((fieldArr)=>{
            query[fieldArr] =  { $in: query[fieldArr].map(id => convertObjectId(id)) } 
    
        })

        return await this.model.deleteMany(query)

    }
}

module.exports = BaseDB