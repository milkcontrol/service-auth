const bcrypt = require('bcryptjs');
const jws = require("jws");
const crypto = require("crypto");
const moment = require('moment');
require('dotenv').config();
const redisClient = require('../lib/redisCLient');


const saltRounds = process.env.HASH_SALT || 12;
const _regexMail = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
const _regexPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const jwtDuration = parseInt(process.env.JWT_DURATION) || 1800;
const jwtSecret = process.env.JWT_SECRET;
const SECRET =
    process.env.JWT_SECRET
const ALGORITHM = process.env.REFRESH_ALGORITHM || 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16;
const KEY = crypto.createHash('sha256').update(String(SECRET)).digest('base64');

const Token = require('../models/token')


const validationMail = (mail) => {
    console.log("Email:", mail)
    if (_regexMail.test(mail)) return true;
    return ({
        "message": "username: must be null type",
        "code": "VALIDATION",
        "data": [{
            "message": "must be null type",
            "Keyword": "regular"
        }]
    })
}
const validationPass = (pass) => {
    if (_regexPass.test(pass)) return false;
    return ({
        "message": 'Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character:',
        "code": "VALIDATION",
        "data": [{
            "message": "Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character:",
            "Keyword": "regular"
        }]
    })
}

const hasPassword = (password) => new Promise((resolve, reject) => {
    bcrypt.hash(password, parseInt(saltRounds), function (err, hash) {
        if (err) {
            return reject(err);}    
        return resolve(hash)
    })
    // bcrypt.genSalt(parseInt(saltRounds), function(err, salt) {
       
// })
    
})
const comparePassword = (password, hash) => new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
        console.log(result);
        if (err) return reject(err);
        return resolve(result);
    });
})

const generateToken = async(sub) => {
    try {
        const iat = Math.floor(Date.now() / 1000);
        const duration = parseInt(process.env.JWT_DURATION || '1800');
        const exp = iat + duration;
        console.log("+++++", exp)

        const payload = {
            header: {alg: 'HS256', type: 'JWT'},
            payload: {...sub, iat, exp},
            privateKey: process.env.JWT_SECRET,
        }
        const accessToken = jws.sign(payload);
        console.log("PPPPPPP1111", accessToken)
        console.log("PPPPPPP2222", typeof accessToken)
        await redisClient.set(
            accessToken,
            JSON.stringify(payload),
            'EX',
            exp,
            (err, reply) => {
              if (err) {
                console.log("error: ", err);
              } else {
                console.log("Record created");
              }
            }
          );
          console.log("accessss", accessToken)
          const getData = await redisClient.get(accessToken)
          console.log(">>>>>>", getData)
          console.log(">>>>>>11111", typeof getData)

        //   console.log(">>>>>>", await redisClient.get(accessToken))
        // const data = jws.decode(accessToken)
        return {accessToken, expiration: moment(exp * 1000).format()};
    }catch (err){
        console.log(err)
    }
}
const compareJwt = (jwt) => {
    const verify = jws.verify(jwt, 'HS256', jwtSecret);
    if (!verify) throw {
        "Message": "jwt invalid",
        "type": "jwt",
        "code": "Invalid jwt"
    }
    const data = jws.decode(jwt)
    const dataPayload = JSON.parse(data.payload)

    const iat = Math.floor((new Date().getTime()/1000))
      if ((dataPayload.exp - iat) <= 0) throw {
        "Message": "jwt expired",
        "type": "jwt",
        "code": "expired jwt"
    }
    return dataPayload;
    // data.payload = JSON.parse(data.payload)
}
const generateRefreshToken = ({sub}) => {
    try {
        // const cipher = crypto.createCipheriv(algorithm, secretKey, nonce,{
        //     authTagLength:16
        // });
        // const cipherText = cipher.update(plaintext,'utf8')
        // const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        // return {
        //     iv: iv.toString('hex'),
        //     content: encrypted.toString('hex')
        // };
        return crypto.AES.encrypt(sub, jwtSecret).toString();
    }catch (err){
        console.log(err)
    }
}
const decryptRefreshToken = (refreshToken) => {
    try {
        const bytes = crypto.AES.decrypt(refreshToken, jwtSecret).toString();
        return bytes.toString(crypto.enc.Utf8);
    }catch (err){
        console.log(err)
    }
}
const encrypt = (data) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        ALGORITHM,
        Buffer.from(KEY, 'base64'),
        iv
    );
    return Buffer.concat([cipher.update(data), cipher.final(), iv]).toString(
        ENCODING
    );
};
const decrypt = (token) => {
    try {
        const binaryData = Buffer.from(token, ENCODING);
        const iv = binaryData.slice(-IV_LENGTH);
        const encryptedData = binaryData.slice(0, binaryData.length - IV_LENGTH);
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            Buffer.from(KEY, 'base64'),
            iv
        );

        return Buffer.concat([
            decipher.update(encryptedData),
            decipher.final(),
        ]).toString();
    } catch (err) {
        return null;
    }
};

const compareRefreshToken = (uidToken) => {
    console.log('????????', SECRET)
    const tokenExist = Token.query().findOne({where:{uid: uidToken}}) ;
    if(!tokenExist) throw {
        "Message": "UID Exist",
        "code": "UID Exist"
    }
    const revok = tokenExist.isRevok
    if(revok === true) throw {
        "Message": "Revok",
        "code": "Revok"
    }
    const expTime = process.env.TOKEN_EXP- Math.floor((new Date().getTime()-Date(tokenExist.createdAt))/1000)
    if(expTime <= 0)throw {
        "Message": "is expired",
        "code": "UID Exist"
    }
    return tokenExist
}

module.exports = {
    validationMail,
    validationPass,
    hasPassword,
    comparePassword,
    generateToken,
    compareJwt,
    generateRefreshToken,
    compareRefreshToken,
    decryptRefreshToken,
    encrypt,
    decrypt
}
