const userController = require("../../controller/userController")
const { generateCreatedAndUpdatedDate } = require("../../lib/generateDate")
const router = require("express").Router()


router.post("/login", async (req, res, next)=>{
    try {
        const token = await userController.login(req)
        res.status(200).json({token})

    } catch (error) {
        next(error)
    }
})


router.post("/create", async (req, res, next)=>{
    try {
        req.body = { ...req.body, ...generateCreatedAndUpdatedDate() }
        const data = await userController.create(req)
        res.status(201).json({
            data
        })
    } catch (error) {
        next(error)
    }
})


module.exports = router