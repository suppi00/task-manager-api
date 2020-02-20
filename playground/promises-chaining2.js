const Task = require("../src/models/task")
require("../src/db/mongoose")
// Task.findByIdAndDelete("5e4a61393f2d9c28bc7a2195").then((task)=>{
//     console.log(task)
//     return Task.countDocuments({completed:true})
// }).then((count)=>{
//     console.log(count)
// }).catch((error)=>{
//     console.log(error)
// })

const DeleteTaskAndCount = async (id)=>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({})
    return count
}
DeleteTaskAndCount("5e4a614b3f2d9c28bc7a2196").then((count)=>{
    console.log(count)
}).catch((error)=>{
    console.log(error)
})