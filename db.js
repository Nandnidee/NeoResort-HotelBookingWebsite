const mongoose = require("mongoose");
var mongoURL = "mongodb+srv://deepikaasingh89:yapcYGlRzh3xAbac@cluster0.fhubyut.mongodb.net/Mern-room"

mongoose.connect(mongoURL)
var connection = mongoose.connection

connection.on("error",()=>{
    console.log("Mongodb Connection failed")
})
connection.on("connected",()=>{
    console.log("MongoDB connection successful")
})

module.exports=mongoose