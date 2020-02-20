require("../src/db/mongoose")
const User = require("../src/models/user")


//promises-chaining

// User.findByIdAndUpdate("5e4a677ee3a1042ff07e5929",{age:22}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({ age: 21 })
// }).then((user)=>{
//     console.log(user)
// }).catch((error)=>{
//     console.log(error)
// })


//async-await

const updateAgeAndCount = async (id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age}) //{age:age} using short hand
    console.log(user)
    const count = await User.countDocuments({age})
    return count    
}
updateAgeAndCount("5e4a677ee3a1042ff07e5929",21).then((count)=>{
    console.log(count)
}).catch((error)=>{
    console.log(error)
})

