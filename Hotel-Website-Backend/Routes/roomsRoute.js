// roomsRoute.js
const express = require("express");
const router = express.Router();
const Room = require('../models/room');

router.get('/rooms', async (req, res) => {
    try {
        const { search } = req.query; // Get search query

        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { type: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const rooms = await Room.find(filter);
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Error fetching rooms.' });
    }
});

router.delete('/rooms/:id', async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Room deleted successfully.' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Error deleting room.' });
    }
});

router.post('/rooms', async (req, res) => {
    try {
        const newRoom = new Room(req.body);
        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({ message: 'Error adding room.' });
    }
});
module.exports = router;
