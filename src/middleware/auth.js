const jwt = require("jsonwebtoken")
const User = require("../models/user")
const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace("Bearer ", "")
        const decode = jwt.verify(token, "iamsupriyaagrawal")
        const user = await User.find({_id:decode._id,"tokens.token":token})
        if(user){
            req.user = user
            next()
        }
    }catch(error){
        res.status(503).send({error:"not authenticated"})
    }
}
module.exports = auth