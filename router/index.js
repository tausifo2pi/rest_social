const notFound = require("../middleware/notFound")
const errHandler = require("../middleware/errHandler")
const {parser} = require("../middleware/parser")
const router = require("express").Router()

router.use(parser)
router.use("/user", require("./user"))
router.use("/public", require("./public"))

//error handler
router.use(errHandler)

// router.use("*", notFound)

module.exports = router