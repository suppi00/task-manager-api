require("./db/mongoose")
const Task = require("./models/task")
const User = require("./models/user")
const express = require("express")
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

//############create###############
app.post("/users", (req, res) => {
    const user = new User(req.body)
    console.log("hi")
    //res.send("hii")
    user.save().then(() => {

        return res.send(user)
    }).catch((error) => {
        res.status(400).send(error)
    })
})


app.post("/tasks", (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        return res.send(task)
    }).catch((error) => {
        res.send(error)
    })
})
//###################READ###############
app.get("/users", (req, res) => {
    User.find({}).then((users) => {
        if (users.length === 0) {
            return res.status(404).send({ status: 404, error: "not found users" })
        }
        return res.send(users)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

app.get("/tasks", (req, res) => {
    Task.find({}).then((tasks) => {
        if (tasks.length === 0) {
            return res.status(404).send({ status: 404, error: "No tasks found" })
        }
        return res.send(tasks)
    })
})

//###############READ ONE##################
app.get("/users/:id", (req, res) => {
    const id = req.params.id
    User.findById(id).then((user) => {
        console.log("hi")
        if (!user) {
            return res.status(404).send({ message: "no users found", status: 404 })
        }
        return res.send(user)
    }).catch((error) => {
        console.log("bye")
        return res.status(500).send(error)
    })
})

app.get("/tasks/:id", (req, res) => {
    const _id = req.params.id
    Task.findById(_id).then((task) => {
        res.send(task)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

//#############################################################################
app.listen(port, () => {
    console.log("server started at port ", port)
})