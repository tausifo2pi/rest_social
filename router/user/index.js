const checkAuth = require("../../middleware/checkAuth")

const router  = require("express").Router()


router.use(checkAuth(process.env.JWT_SECRET))
router.use("/isValidToken", async (req, res, next)=>{
    res.status(200).send("valid")
})
router.use("/profile", require("./profile"))
router.use("/users", require("./user"))
router.use("/posts", require("./post"))
router.use("/comments", require("./comment"))
router.use("/likes", require("./like"))



module.exports = router
