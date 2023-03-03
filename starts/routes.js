
const routeAuth = require("../routes/auth")
const routeUser = require("../routes/user")

const routes = (app)=>{ 
    app.use("/", routeAuth)
    app.use("/user", routeUser)
    app.get("/test", (req, res)=>{res.send("ok")})
}

module.exports = routes