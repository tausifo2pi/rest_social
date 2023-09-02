const { rootDirectory } = require("../directory")
const path = require("path")
const { isObject } = require("../lib/isAnything")


const options = {
    multiples: true,
    uploadDir: path.join(rootDirectory, "public", "file", "upload"),
    maxFileSize: 10 * 1024 * 1024,
    keepExtensions: true,
}



async function parser(req, res, next){
    try {
        if(req.method == "post" || req.method == "put" ) req.body = req.body
        if(req.method == "get" || req.method == "delete" ) req.query = req.query
        next()
    } catch (error) {
        next(error)
    }
}


function parseRequest(approvedFields = [], approvedExt = ["pdf", "png", "jpg", "jpeg", "doc", "docx", "xlsx", "xls", "word", "webp", "json", "gif"]){
    return function (req, res, next){
        const body = req.body
        const files = {}
        const filesError = {}
        for (let field of approvedFields) {
            
            if(field in body) {
                files[field] = []

                if(isObject(body[field])) body[field] = [body[field]]
                
                for(let file of body[field]){
                    
                    if(file.name && file.type) {
                        

                        const fileType = file.type.split("/")[1]
                        if(approvedExt.includes(fileType)){
                            files[field] = [...files[field], file, ]
                        }
                        else {
                            filesError[field] = "invalid file extension " + fileType 
                        }
                    }
                    else {
                        filesError[field] = "can't upload empty file " + field
                    }
                }
                delete body[field]
            }
        }
        if(Object.keys(filesError).length) next(filesError)
        req.body = body
        req.files = files
        next()
    } 
}




module.exports ={
    parser,
    parseRequest
}