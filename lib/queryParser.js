
function paginationQueryParser(query){
    let {sortBy, sortOrder, page, limit} = query
    

    sortOrder = Number(sortOrder)
    page = Number(page)
    limit = Number(limit)

    return {
        page: !isNaN(page) ? page: 1,
        limit: !isNaN(limit) ? limit: 20,
        sortBy: sortBy ? sortBy : "createdAt",
        sortOrder: !isNaN(sortOrder) ? sortOrder: 1,

    }
}


function filterQueryParser(query, fields){
    const filter = {}
    for(let field of fields){
        if(query[field] && typeof query[field] === "string" && typeof query[field].trim() == "string" ){
            filter[field] = query[field].trim()
        }
    }
    return filter
}

module.exports = {
    paginationQueryParser,
    filterQueryParser

}