const userController = require("../../controller/userController")
const tokenDB = require("../../database/tokenDB")
const { generateUpdatedDate } = require("../../lib/generateDate")

const router = require("express").Router()



router.get("/", async (req, res, next) => {
    try {
        req.query = { ...req.query, _id: req.user._id }
        const data = await userController.readOne(req)
        res.status(data ? 200 : 204).json(data)

    } catch (error) {
        next(error)
    }
})

router.put("/", async (req, res, next) => {
    try {

        req.query = { _id: req.user._id }
        req.body = { ...req.body, ...generateUpdatedDate() }
        const data = await userController.update(req)
        res.json(data)
    } catch (error) {
        next(error)
    }
})


router.delete("/", async (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1]
    try {
        req.query = { _id: req.user._id }
        const result = await userController.delete(req)
        
        if(result){
            console.log(token);
            const _rest = await tokenDB.create({token})
            console.log(_rest);
            res.status(204).json({message: "User deleted successful"})
        }
        else {
            res.status(400).json({message: "Failed!"})
        }


    } catch (error) {
        next(error)
    }
})




router.put("/update-password", async (req, res, next) => {
    try {

        req.body = { ...req.body, ...generateUpdatedDate() }
        req.query = { _id: req.user._id }
        await userController.updatePassword(req)
        res.json({ message: "password successfully changed" })
    } catch (error) {
        next(error)
    }
})






module.exports = router