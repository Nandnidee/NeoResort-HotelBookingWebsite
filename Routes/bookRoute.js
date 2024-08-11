const express = require('express');
const Booking = require('../models/book'); // Adjust path as necessary
const router = express.Router();
const nodemailer = require('nodemailer');
const razorpay = require('razorpay');
const crypto = require('crypto');

// Razorpay credentials
const razorpayInstance = new razorpay({
    key_id: 'rzp_test_2yCKwCvsmmVI09',
    key_secret: 'Thk9YR4KF1TZKt6A2RPweRPS'
});

// Nodemailer setup with hardcoded credentials
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
        user: 'neoresortkanatal@gmail.com',
        pass: 'kgumxbyagmdvspig',
    },
});

// Route to handle booking and create Razorpay order
router.post('/book', async (req, res) => {
    const bookingDetails = req.body;

    console.log('Received booking details:', bookingDetails);

    if (!bookingDetails.amount || typeof bookingDetails.amount !== 'number') {
        console.error('Invalid amount:', bookingDetails.amount);
        return res.status(400).json({ message: 'Amount is required and should be a number.' });
    }

    try {
        const amount = bookingDetails.amount * 100; // Amount in paise
        const currency = 'INR';
        const paymentCapture = 1; // Auto capture

        const options = {
            amount,
            currency,
            receipt: `receipt_order_${new Date().getTime()}`,
            payment_capture: paymentCapture,
        };

        const response = await razorpayInstance.orders.create(options);
        console.log('Razorpay order response:', response);

        return res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            bookingDetails,
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'Booking failed. Please try again later.' });
    }
});

// Route to handle payment verification
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: 'Missing required fields for verification.' });
    }

    const generatedSignature = crypto.createHmac('sha256', 'Thk9YR4KF1TZKt6A2RPweRPS')
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (generatedSignature === razorpay_signature) {
        // Payment verified
        res.json({ message: 'Payment verified successfully' });
    } else {
        // Signature mismatch
        res.json({ message: 'Payment verification failed' });
    }


    try {
        const newBooking = new Booking({
            selectedRoomTypes: bookingDetails.selectedRoomTypes,
            adults: bookingDetails.adults,
            children: bookingDetails.children,
            checkInDate: bookingDetails.checkInDate,
            checkOutDate: bookingDetails.checkOutDate,
            email: bookingDetails.email,
            name: bookingDetails.name,
            phone: bookingDetails.phone,
            amount: bookingDetails.amount,
        });
        await newBooking.save();

        const mailOptions = {
            from: 'neoresortkanatal@gmail.com',
            to: bookingDetails.email,
            subject: 'Booking Confirmation',
            text: `Dear ${bookingDetails.name},

Thank you for booking with Neo Resort!

We are pleased to confirm your booking as follows:
- Check-In Date: ${new Date(bookingDetails.checkInDate).toLocaleDateString()}
- Check-Out Date: ${new Date(bookingDetails.checkOutDate).toLocaleDateString()}
- Total Cost: ₹${bookingDetails.amount}
- Room Details: ${JSON.stringify(bookingDetails.selectedRoomTypes, null, 2)}

If you have any questions or need further assistance, please do not hesitate to contact us.

Best Regards,
Neo Resort`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        return res.status(201).json({ message: 'Payment verified successfully. Your booking is confirmed!' });
    } catch (error) {
        console.error('Error processing booking:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'Booking failed. Please try again later.' });
    }
});

router.get('/bookings', async (req, res) => {
    try {
        const { search } = req.query; // Get search query

        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { checkInDate: { $regex: search, $options: 'i' } },
                    { checkOutDate: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const bookings = await Booking.find(filter);
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings.' });
    }
});

module.exports = router;


router.delete('/bookings/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Booking deleted successfully.' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Error deleting booking.' });
    }
});

module.exports = router;
