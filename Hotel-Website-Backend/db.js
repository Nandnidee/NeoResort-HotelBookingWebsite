const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://deepikaasingh89:deep89ika@cluster0.fhubyut.mongodb.net/Mern-room?retryWrites=true&w=majority";

mongoose.connect(mongoURL, {
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true, // Use new server discovery and monitoring engine
    dbName: "Mern-room" // Specify the database name
});

const connection = mongoose.connection;

connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

connection.once("open", () => {
    console.log("MongoDB connection successful");
});

module.exports = mongoose;
