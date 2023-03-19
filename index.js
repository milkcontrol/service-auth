const express = require('express')
const bodyParser = require('body-parser')

const knexConfig = require('./src/database/config');
const objection = require('objection')
const routes = require("./starts/routes");
const cors = require("cors");
const cookieParser = require('cookie-parser')
// const Redis = require("ioredis");


const main = async () => {
    objection.Model.knex(knexConfig)
    const server = express();
    const corsConfig = {
        credentials: true,
        origin: true,
    };
    server.use(cors(corsConfig));
    server.use(cookieParser())
    const port = process.env.PORT
    server.use(bodyParser.json());
    server.use(express.urlencoded({
        extended: true
    }))
    // const redisClient = new Redis({
    //     port: Number(process.env.REDIS_PORT),
    //     host: process.env.REDIS_HOST,
    //   });
     
    // redisClient.on("error", (err) => console.log("Redis Client Error", err));

    // redisClient.on("connect", () => {
    //   console.log("Connected to Redis");
    // });
    
    routes(server)
    
    server.listen(port || 3000, (err) => {
        if (err) throw err
        console.log(`Example app listening on port ${port || 3000}`)
    })
}

main()
