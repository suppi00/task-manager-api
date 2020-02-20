const express = require("express")
const User = require("../models/user")
const Task = require("../models/task")
const auth = require("../middleware/auth")

const app = express()
app.use(express.json())
const router = new express.Router()
router.post("/users", async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)
    
    try {
        const token = await user.getAuthToken()
        await user.save()
        return res.status(201).send(user)
    } catch (e) {
        res.send(e)
    }
})

router.get("/users/profile", auth,async (req, res) => {
    console.log("hii user")
    res.send(req.user)
})


router.get("/users/:id", async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({ status: 404, message: "no user found" })
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch("/users/:id", async (req, res) => {
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
        const user = await User.findById(req.params.id)
        updates.forEach((update)=>{
            user[update] = req.body[update]
        })
        await user.save()
        return res.send(user)
    }catch(error){
        res.status(500).send()
    }
})

router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send({ message: "user not found" })
        }
        return res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.post("/users/login",async (req,res)=>{
    console.log("hiiiiii")
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.getAuthToken()
        console.log(token)
        res.send({user,token})
    }catch(e){
        console.log(e)
        //case 1  res.status(400).send()
        res.status(400).send(e) 
    }
})
module.exports = router