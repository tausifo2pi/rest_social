//config dotenv in top level for avoiding unexpected error
const dotenv = require("dotenv")
dotenv.config()


const express = require('express')

const app = express()
const mongoose = require('mongoose');



app.use("/api/v1", require("./router"))

//mongoose connection will go here 


//here is router
const projectController = require("../../controller/projectController")
const addFieldToEntity = require("../../lib/addFieldToEntity")
const { generateCreatedAndUpdatedDate } = require("../../lib/generateDate")
const router = require("express").Router()


router.get("/", async (req, res, next)=>{
    try {
        
        const result = await projectController.read(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    } 
})  

router.post("/", async (req, res, next)=>{
    try {
        const concatObj = {
            ...generateCreatedAndUpdatedDate()
        }
        req.body = addFieldToEntity(req.body, concatObj)
        const result = await projectController.create(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
})


module.exports = router




//here is controller
const BaseController = require("../base/BaseController");
const { paginationQueryParser, filterQueryParser } = require("../lib/queryParser");
const projectService = require("../service/projectService");



class ProjectController extends BaseController {
    constructor() {
        super(projectService)
    }

    async read(req) {

        const filter = filterQueryParser(req.query, ["_id", "title", "fields"])
        const options = paginationQueryParser(req.query)
        return await this.service.read(filter, {}, options)
    }

}

module.exports = new ProjectController()

//BaseController
class BaseService {
    constructor(db){
        this.db = db
    }

    async create(input){
        return await this.db.insert(input)
    }

    async __read(query){
        return await this.db.read(query)
    }

    async read(query){
        return await this.__read(query)
    }

    async update(query ,payload){
        const result =  await this.db.update(query ,payload)
        return {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            data: payload,

        }
    }
}
module.exports = BaseService


//here is service
const BaseService = require("../base/BaseService");
const projectDB = require("../database/projectDB");

const validationError = require("../lib/validationError");

class ProjectService extends BaseService{

    constructor(){
        super(projectDB)
    }

    async create(payload){
        let errors = {}

        if(!payload.fields || !Array.isArray(payload.fields)) errors.fields = "invalid fields"

        if(Object.keys(errors).length) throw validationError(errors)

        return await this.db.insert(payload)
    }

    async read(filter, resolve, options){
        return await this.db.read(filter, resolve, options)
    }
}


module.exports = new ProjectService()

//BaseService
class BaseService {
    constructor(db){
        this.db = db
    }

    async create(input){
        return await this.db.insert(input)
    }

    async __read(query){
        return await this.db.read(query)
    }

    async read(query){
        return await this.__read(query)
    }

    async update(query ,payload){
        const result =  await this.db.update(query ,payload)
        return {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            data: payload,

        }
    }
}
module.exports = BaseService

//here is database
const BaseDB = require("../base/BaseDB");
const ProjectModel = require("../model/ProjectModel");
const { sortStage, unsetStage } = require("./utils/commonStage");
const Paginate = require("./utils/Paginate");
const { convertObjectId } = require("./utils/utils");


const paginate = new Paginate(ProjectModel);

const matchStage = (filter) => {

    if(filter._id) filter._id = convertObjectId(filter._id);
    
    return [
        {
            $match: {
                
                ...filter,
                 
            }
        }
    ]
}




class ProjectDB extends BaseDB{
    constructor(){
        super(ProjectModel)
    }

    async read(filter = {}, resolve = {}, options = {}){
        const stages = [
            ...matchStage(filter),
            ...unsetStage(["__v"])
        ];
        const facetStages = {
            data: [
                ...sortStage(options.sort, options.sortOrder, options.limit, options.page),
            ]
        }
        const result = await paginate.exec(stages, facetStages);
        return result
    }

    async findOne(filter = {}){
        const result =  await this.model.findOne(filter)
        return result
    }
}

module.exports = new ProjectDB()

//here is Model
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({

title: {
  type: String,
  required: [true, "enter title"],
  minlength: [2, "minimum title length is 2 characters"]
},

fields:{
  type: [String],
  required: [true, "fields can not be empty"],

},
createdAt: {
  required: [true, "invalid createdAt date"],
  type: Date
},
updatedAt: {
  required: [true, "invalid updatedAt date"],
  type: Date
}
});

const ProjectModel = mongoose.model("project", projectSchema, "project");



module.exports = ProjectModel;

//BaseDB
class BaseDB {
    constructor(Model){
        this.model = Model
    }
    async insert(payload){
        return await this.model.create(payload)
    }
    async insertMany(payload){
        return await this.model.insertMany(payload)
    }

    async read(query){
        return await this.model.find()
    }
    
    async readOne(query){
        return await this.model.findOne(query)
    }
    async update(query, payload){
        return await this.model.update(query, payload)
    }
}

module.exports = BaseDB

//Paginate

const { isObject, isRealPositiveNumber } = require("../../lib/isAnything")


class Paginate {

    constructor(Model){
        this.Model = Model
    }

    async prepare(filter = [], facet = []){
        const pipeLine = []

        //filter stage
        pipeLine.push(...filter)

        //facet stage
        const facetStage = {
            $facet: {
                page: [
                    {
                        $group: {
                            _id: null,
                            totalIndex: { $sum: 1 },
                        }
                    },
                    
                    {
                        $unset: ["_id"]
                    },
                ],
                ...facet
                
            }
        }
        pipeLine.push(facetStage)
        return pipeLine


    }

    
    async exec(filter, facet){

        // const validateParam = this.__checkObjectDependency([aggregation, options])
        // if( validateParam !== true) throw validationError(validateParam, 500)
        const prepare =await  this.prepare(filter, facet)
        let response = await this.Model.aggregate(prepare)

        return response[0]


    }
}

module.exports = Paginate