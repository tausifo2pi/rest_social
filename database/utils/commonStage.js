const { isString } = require("../../lib/isAnything")
const { convertOrErrorObjectIds } = require("./utils")

module.exports.sortStage = (sortBy="createdAt", sortOrder=1, limit= 20, page=1)=>{

    return [
        {
            $sort: {
                [sortBy]: parseInt(sortOrder) || 1
            }
        },
        {
            $skip: parseInt(limit * (page - 1)) || 0
        },

        {
            $limit: parseInt(limit) || 20 //default 20 . from controller its coming from 
        }

    ]
}


module.exports.unsetStage = (stage)=>{
    return [
        {
            $unset: stage
        }
    ]
}


module.exports.singleLookupStage = (from, localField, foreignField, as, unwindPath) => {
    return [
        {
            $lookup: {
                from,
                localField,
                foreignField,
                as
            }
        },
        {
            $unwind: {
                path: `$${unwindPath}`,
            }
        }
    ]
}

module.exports.lookupStage = (from, localField, foreignField, as, ) => {
    return [
        {
            $lookup: {
                from,
                localField,
                foreignField,
                as
            }
        },

    ]
}

module.exports.matchStage = (filter = {}, idFields = [], textFields = []) => {

    const { objectIds } = convertOrErrorObjectIds(filter, idFields)

    const textMatch = {}
    textFields.forEach(element => {
        if(filter.hasOwnProperty(element))textMatch[element] = filter[element]

    });

    const arr = [
        {
            $match: {

                ...objectIds,
                ...textMatch
            }
        }
    ]
    console.log(arr);
    return arr
}


module.exports.caseInsensitiveMatchStage = (filter = {}, whichFields = []) => {
    const fields = {}
    whichFields.forEach((field) => {
        const searchValue = filter[field]
        if (isString(searchValue)) {
            fields[field] = {
                $expr: {
                    $eq: [
                        { $toLower: `$${field}` },
                        { $toLower: searchValue }
                    ]
                }
            }
        }
    })
    return fields
}