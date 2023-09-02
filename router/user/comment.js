const commentController = require("../../controller/commentController")
const { generateUpdatedDate, generateCreatedAndUpdatedDate } = require("../../lib/generateDate")

const router = require("express").Router()

router.post("/", async (req, res, next)=>{
    try {
        req.body = { ...req.body, user: req.user._id ,...generateCreatedAndUpdatedDate() }
        const data = await commentController.create(req)
        res.status(201).json({
            data
        })
    } catch (error) {
        next(error)
    }
})


router.get("/:_id", async (req, res, next)=>{
    try {

        req.query = { ...req.query, _id: req.params._id}

        const data = await commentController.readOne(req)
        res.status(data? 200 : 204).json(data)

    } catch (error) {
        next(error)
    }
})



router.get("/", async (req, res, next)=>{
    try {
        
        const result = await commentController.read(req)
        res.json(result)

    } catch (error) {
        next(error)
    }
})

router.put("/:_id", async (req, res, next)=>{
    try {

        req.query = {user: req.user._id, _id: req.params._id}
        req.body = {...req.body, ...generateUpdatedDate()}
        const data = await commentController.update(req)
        res.json(data)
    } catch (error) {
        next(error)
    }
})


router.delete("/:_id", async (req, res, next) => {
    try {
        req.query = { user: req.user._id, _id: req.params._id }
        const result = await commentController.delete(req)
        
        if(result){
            res.status(204).json({message: "Comment deleted successful"})
        }
        else {
            res.status(400).json({message: "Failed!"})
        }


    } catch (error) {
        next(error)
    }
})








module.exports = router