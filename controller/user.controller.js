const {v4: uuidv4} = require('uuid');
const {
    validationPass,
    hasPassword,
    validationMail,
} = require("../utils/validation");
const User = require('../models/user')


const userCreate = async (req, res, next) => {
    try {
        const {username, password} = req.body;        
        // if(
        //     req.jwtDecode?.role &&
        //     req.jwtDecode?.role !== 1 
        // )return res.status(401).send("No access permission")
        
        const checkMail = validationMail(username);
        if (!checkMail) return res.status(422).send(
            checkMail
        )
        const userExist = await User.query().findOne({username})

        if (userExist) return res.status(422).send({
            "Message": "username already exist",
            "code": "validation",
            "data": {
                "username": [
                    {
                        "message": "username already exist, please use anothor username or login",
                        "keyword": "duplicate"
                    }
                ]
            }
        })
        const checkPass = validationPass(password);
        if (checkPass) return res.status(422).send(checkPass);
        const hasPass = await hasPassword(password);
        const uid = uuidv4();
        const data = await User.query().insert({
            uid: uid,
            username: username,
            password: hasPass,
            role: 2,
        })
        return res.send(data)
    } catch (err) {
        return res.status(400).send(err)
    }
}

const getUSer = async (req, res, next) => {
    try {
        if(req.jwtDecode?.role !== 1)return res.status(401).send("No access permission")
        const data = await User.query().findByIds(req.params.id)
        return res.send(data)
    } catch (err) {
        return res.status(401).send(err)
    }
}


module.exports = { userCreate, getUSer }
