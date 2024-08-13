const express = require("express");
const mongoose = require("./db"); // Adjust path as necessary
const cors = require('cors');
// Require routes
const roomsRoute = require('./Routes/roomsRoute');
const bookingRoutes = require('./Routes/bookRoute');
const admin = require('./Routes/admin');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/admin', admin);
app.use('/api', bookingRoutes);
app.use('/api', roomsRoute);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
