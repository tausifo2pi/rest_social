const userController = require("../../controller/userController")
const router = require("express").Router()


router.get("/", async (req, res, next)=>{
    try {
        
        const result = await userController.read(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    } 
}) 

router.get("/:_id", async (req, res, next)=>{
    try {
        req.query = {...req.query, _id: req.params._id}
        const data = await userController.readOne(req)
        res.status(data? 200 : 204).json(data)
    } catch (error) {
        next(error)
    } 
})  



module.exports = router