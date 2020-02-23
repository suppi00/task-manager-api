const express = require("express")
const User = require("../models/user")
const Task = require("../models/task")
const auth = require("../middleware/auth")
const multer = require("multer")
const sharp = require("sharp")
const { sendWelcomeEmail ,sendDeleteMail} = require("../emails/account")
const app = express()
app.use(express.json())
const router = new express.Router()
//create user
router.post("/users", async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.getAuthToken()
        return res.status(201).send({user,token})
    } catch (e) {
        res.send(e)
    }
})

//user profile
router.get("/users/me", auth,async (req, res) => {
    console.log("hii user")
    res.send(req.user)
})
//********************************************
router.patch("/users/me", auth,async (req, res) => {
    const availableUpdates = ["name", "age", "email", "password"]
    const updates = Object.keys(req.body)
    const isUpdateValid = updates.every((update) => {
        return availableUpdates.includes(update)
    })
    if (!isUpdateValid) {
        return res.status(400).send({ error: "Invalid update parameters" })
    }
    try{
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })
        updates.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save()
        return res.send(req.user)
    }catch(error){
        res.status(500).send()
    }
})
//****************************************** 
router.delete("/users/me", auth ,async (req, res) => {
    try {
        await req.user.remove()
        sendDeleteMail(req.user.email,req.user.name)
        return res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

//***********************************
router.post("/users/login",async (req,res)=>{
    console.log("hiiiiii")
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.getAuthToken()
        res.send({user,token})
    }catch(error){
        res.status(400).send(error) 
    }
})
//********************************************* 
router.post("/users/logout",auth,async (req,res)=>{
    try{
        console.log(req.token)
        console.log(req.user)
        console.log(req.user.tokens)
        req.user.tokens = req.user.tokens.filter((token)=>{
            console.log(token)
            return token.token!== req.token
        })
        await req.user.save()
        console.log("logout")
        res.send("Logged out!")
    }catch(error){
        console.log(error)
        console.log("not logout")
        res.status(500).send(error)
    }
})
//**********************************************
const upload = multer({
    //dest:"avatars",
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error("only images are allowed"))
        }
        cb(undefined,true)
    }
})
router.post("/users/me/avatar",auth, upload.single("avatar"),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    console.log(req.user.avatar)
    console.log("hiiiznbczvxcbbcvbvi")
    await req.user.save()
    res.send(req.user)
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete("/users/me/avatar",auth,async (req,res)=>{
    if(req.user.avatar){
        req.user.avatar= undefined
        try{
            await req.user.save()
            return res.send("ok")
        }catch(error){
            res.status(500).send()
        }
    }
    res.send("not found")
})
router.get("/users/:id/avatar",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type',"image/png")
        res.send(user.avatar)
    }catch(error){
        res.status(404).send()
    }
})
module.exports = router