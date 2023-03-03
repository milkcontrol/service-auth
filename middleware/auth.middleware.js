const {compareJwt} = require("../utils/validation");
const jws = require("jws");

const authMiddleware = (req, res, next) => {
    try{
        let accessToken = req.headers.authorization.split(" ") [1];
        if(!accessToken) {
            res.status.send({
                "Message": "Invalid",
                "Code": "UID Exist"
            })
        }
        const compare = compareJwt(accessToken);
        req.jwtDecode = compare
        next()
    }catch (e){
        if(!e.type || e.type !== "jwt") return res.status(401).send({
            "Message": "jwt invalid",
            "type": "jwt",
            "code": "Invalid jwt"
        })
        return res.status(401).send(e)
    }
}
module.exports = authMiddleware
