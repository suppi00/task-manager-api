const mongoose = require("mongoose")
mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser:true,useCreateIndex:true})


//console.log(process.env.CONNECTION_URL);

//mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true })