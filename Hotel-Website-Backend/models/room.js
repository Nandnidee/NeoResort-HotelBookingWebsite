const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    area: {
        type: String
    },
    adult: {
        type: Number
    },
    child: {
        type: Number
    },
    rentperday: {
        type: Number
    },
    currentbook: {
        type: [String]
    },
    type: {
        type: String
    },
    description: {
        type: String
    }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
