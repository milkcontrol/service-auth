const {v4: uuidv4} = require('uuid');
const {
    validationPass,
    generateToken,
    validationMail, comparePassword,
    encrypt, decrypt
} = require("../utils/validation");

const User = require('../models/user')

const Token = require('../models/token')
const durationToken = Number(process.env.REFRESH_DURATION || 8760);
const login = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        if(!username || !password)return res.status(400).send(
            'login credient'
        )
        const checkMail = validationMail(username);
        if (!checkMail) {
            return res.status(422).send(
                checkMail
            )
        }
        const userExist = await User.query().findOne({username})
        if (!userExist) return res.status(422).send({
            "Message": "Invalid account or password",
            "code": "validation",
            "data": {
                "username": [
                    {
                        "message": "Invalid account or password",
                        "keyword": "duplicate"
                    }
                ]
            }
        })
        const checkPass = validationPass(password);
        if (checkPass) return res.status(422).send(checkPass);
        const result = await comparePassword(password, userExist.password);
        if (result === true) {
            // res.send('login success')
        } else {
            return res.status(422).send({
                "message": "Invalid account or password",
                "code": "VALIDATION",
                "data": [{
                    "message": "Invalid account or password",
                    "Keyword": "regular"
                }]
            })
        }
        const accessToken = generateToken({
            sub: userExist.uid,
            username: userExist.username,
            role: userExist.role
        });

        userExist.accessToken = accessToken
        const uid = uuidv4();
        await Token.query().insert({
                uid: uid, userId: userExist.uid, isRevoked: 0
            },
        );
        const refreshToken = encrypt(uid)
        const cookieName = process.env.REFRESH_COOKIE_NAME || 'refresh_token';
       
        res.cookie(cookieName, refreshToken, {
            // domain: process.env.DOMAIN,
            maxAge: 900000,
            httpOnly: true,
            // secure: true,
            sameSite: "none",
            
        });
        
        const dataUser = {
            token:accessToken,
            refreshToken: refreshToken,
            userId: userExist.uid,
            username: userExist.username
        }
        res.send(dataUser)
    } catch (err) {
        return res.status(401).send(err)
    }
}

const refreshTok = async (req, res, next) => {
    try {
        const cookieName = process.env.REFRESH_COOKIE_NAME || 'refresh_token';
        const durationToken = Number(process.env.REFRESH_DURATION || 8760);
        let token = req.cookies[cookieName];
        // if (!token) token = req.body.refreshToken;
        if (!token)
            return res.status(401).send(
                'Refresh token không hợp lệ !',
                'E_INVALID_REFRESH_TOKEN'
            )
        const tokenId = decrypt(token);
        if (!tokenId) {
            return res.status(401).send(
                'Refresh token không hợp lệ !',
                'E_INVALID_REFRESH_TOKEN'
            )
        }
        const foundedToken = await Token.query().findById(tokenId);
        if (foundedToken === null)
            return res.status(401).send(
                'Refresh token không hợp lệ 33!',
                'E_INVALID_REFRESH_TOKEN'
            )
        if (foundedToken.isRevoked === '1')
            return res.status(401).send(
                'Refresh token đã bị thu hồi !',
                'E_INVALID_REFRESH_TOKEN'
            )
        const duration = Date.now() - new Date(foundedToken?.createdAt).getTime();
        const usefulTime = durationToken * 60 * 60 * 1000 - duration;
        if (usefulTime <= 0) {
            foundedToken.isRevoked = true;
            await foundedToken.save();
            return res.status(401).send(
                'Refresh token hết hạn !',
                'E_INVALID_REFRESH_TOKEN'
            )
        }
        const foundedUser = await User.query().findById(foundedToken.userId);
        const accessToken = generateToken({
            sub: foundedUser.uid,
            username: foundedUser.username,
            role: foundedUser.role
        });
        res.send(accessToken);
    } catch (e) {
        return res.status(401).send(e)
    }
}

module.exports = { login , refreshTok }
