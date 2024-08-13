const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    selectedRoomTypes: Object,
    adults: Object,
    children: Object,
    checkInDate: String,
    checkOutDate: String,
    email: String,
    name: String,
    phone: String,
    amount: Number, // Ensure this field is included in the schema
});

module.exports = mongoose.model('Booking', bookingSchema, 'bookings');
