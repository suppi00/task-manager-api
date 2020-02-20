const express = require("express")
const User = require("../models/user")
const Task = require("../models/task")
const app = express()
const router = new express.Router()
router.post("/tasks", async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        return res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({})
        if (tasks.length === 0) {
            return res.status(404).send({ status: 404, message: "no tasks found" })
        }
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/tasks/:id", async (req, res) => {
    const _id = req.params.id
    try {
        const task = Task.findById(id)
        if (!task) {
            return res.status(404).send({ status: 404, message: "task not found" })
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch("/tasks/:id", async (req, res) => {
    const availableUpdates = ["description", "completed"]
    const updates = Object.keys(req.body)
    const isValidUpdates = updates.every((update) => {
        return availableUpdates.includes(update)
    })
    if (!isValidUpdates) {
        return res.status(400).send({ error: "Invalid parameters updates" })
    }
    try{
        const task= await Task.findById(req.params.id)
        if(task){
            updates.forEach((update)=>{
                task[update] = req.body[update]
            })
            await task.save()
            return res.send(task)
        }   
        res.status(404).send({message:"user not found"})
    }catch(error){
        res.status(500).send()
    }

})
router.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).send({ message: "task not found!" })
        }
        return res.send({ status: 200, message: "task deleted" })
    } catch (error) {

    }
})
module.exports = router