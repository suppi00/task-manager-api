require("./db/mongoose")
const Task = require("./models/task")
const User = require("./models/user")
const express = require("express")
const app = express()
//const dotenv = require("dotenv").config()
const port = process.env.PORT
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const multer = require("multer")
const upload = multer({
    dest:'images',
    fileFilter(req,file,cb){
        if(!file.originalname.endsWith(".jpg")){
            cb(new Error("only jpgs are allowed"))
        }
        cb(undefined,true)
    }   
})
// const errorHandlerMiddleware= (req,res,next)=>{
//     throw new Error("some error")
// }   
app.post("/upload",upload.single("upload"),(req,res)=>{
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

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

//  const myFunction2 = async()=>{
//     const task = await Task.findById("5e4f9bced3988a2450d80e88")
//     await task.populate("owner").execPopulate()
//     console.log(task.owner)

//     const user = await User.findById("5e4f9aaae2e6621178c65e7d")
//     await user.populate("tasks").execPopulate()
//     console.log(user.tasks)
//  }
// myFunction2()
app.listen(port, () => {
    console.log("server started at port ", port)
})