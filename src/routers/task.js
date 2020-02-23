const express = require("express")
const User = require("../models/user")
const Task = require("../models/task")
const auth = require("../middleware/auth")
const app = express()
const router = new express.Router()
router.post("/tasks", auth,async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try {
        await task.save()
        return res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

//GET /tasks?completed=true
//GET /tasks?sortBy=createdAt:desc
router.get("/tasks",auth, async (req, res) => {
    try {
        const match={}
        const sort = {}
        //const tasks = await Task.find({owner:req.user._id})   //this is also correct
        if(req.query.completed){
            match.completed = req.query.completed==="true"
        }
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] =  parts[1]==="desc" ? -1:1
        }
        await req.user.populate({
            path:"tasks",
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort,
            }
        }).execPopulate()
        const tasks = req.user.tasks
        if (tasks.length === 0) {
            return res.status(404).send({ status: 404, message: "no tasks found" })
        }
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/tasks/:id", auth,async (req, res) => {
    const _id = req.params.id
    try {
        //const task = Task.findById(id)
        const task = await Task.findOne({_id,owner:req.user._id})
        if (!task) {
            return res.status(404).send({ status: 404, message: "task not found" })
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch("/tasks/:id", auth,async (req, res) => {
    const availableUpdates = ["description", "completed"]
    const updates = Object.keys(req.body)
    const isValidUpdates = updates.every((update) => {
        return availableUpdates.includes(update)
    })
    if (!isValidUpdates) {
        return res.status(400).send({ error: "Invalid parameters updates" })
    }
    try{
        //const task= await Task.findById(req.params.id)
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(task){
            updates.forEach((update)=>{
                task[update] = req.body[update]
            })
            await task.save()
            return res.send(task)
        }   
        res.status(404).send({message:"task not found"})
    }catch(error){
        res.status(500).send()
    }

})
router.delete("/tasks/:id", auth,async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        //const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).send({ message: "task not found!" })
        }
        return res.send({ status: 200, message: "task deleted" })
    } catch (error) {
        return res.status(500).send("some error")
    }
})
module.exports = router