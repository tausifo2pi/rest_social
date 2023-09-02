const {isValidObjectId , Types} = require("mongoose")
const {ObjectId} = Types

const convertObjectId = (id)=>{
    if(id instanceof ObjectId){
        return id
    }
    return ObjectId(id)
}

const isObjectId = (input)=>{
    return isValidObjectId(input)
}


const convertOrErrorObjectIds = (obj, fields = [])=>{

    const errors = {}
    const objectIds = {}

    fields.forEach((field)=>{
        if(!obj[field] || !isObjectId(obj[field])) errors[field] = `invalid ${field} id`
        else objectIds[field] = convertObjectId(obj[field])
    })

    return { objectIdErrors: Object.keys(errors).length ? errors: {} , objectIds}
}


module.exports = {
    convertObjectId,
    isObjectId,
    convertOrErrorObjectIds
}





