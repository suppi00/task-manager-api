const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 20,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("age cannot be negative")
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email!")
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("password must not contain password word!")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]

})
userSchema.methods.getAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},"iamsupriyaagrawal")
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){   
        throw new Error("Unable to login")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("Unable to login")
    }
    return user
}
userSchema.pre("save",async function (next){
    const user = this
    console.log("before saving")
    if(user.isModified("password")){
        console.log("byee")
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})
const User = mongoose.model("User",userSchema)
module.exports = User