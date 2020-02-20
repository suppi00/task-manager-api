require("./db/mongoose")
const Task = require("./models/task")
const User = require("./models/user")
const express = require("express")
const app = express()
const port = process.env.PORT || 3000

const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


//without middleware == request---> run routers
//with middleware == request-->do something-->run routers


// const jwt = require("jsonwebtoken")
// const myFunction = ()=>{
//     const token = jwt.sign({_id:"abc123"},"thisissupriyaagrawal")
//     console.log(token)
//     const isValidSecretKey = jwt.verify(token,"thisissupriyaagrawal")
//     console.log(isValidSecretKey)
// }
// myFunction()

app.listen(port, () => {
    console.log("server started at port ", port)
})