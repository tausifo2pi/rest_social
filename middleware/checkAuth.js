const tokenDB = require("../database/tokenDB");
const ApiError = require("../lib/ApiError");
const { verifyToken } = require("../lib/token");


const errorObj = {
    name: "Authentication",
    errors: {
        msg: "authentication failed"
    }
}
function checkAuthBuilder(secret) {
    return async function checkAuth(req, res, next) {
        if ("authorization" in req.headers) {
            const token = req.headers["authorization"].split(" ")[1]
            try {

                if (!token) throw "😁😁"
                const blackListed = await tokenDB.readOne({token})
                console.log(blackListed);
                if(blackListed) throw "😋😋"
                const payload = await verifyToken(token, secret)
                req.user = payload
                next()
            } catch (error) {
                next(new ApiError({ message: "Can not verify token" }, "Unauthorized ", 401))
            }
        }
        else {
            next(new ApiError({ message: "Missing Authorization Header" }, "Unauthorized ", 401))
        }
    }
}

module.exports = checkAuthBuilder