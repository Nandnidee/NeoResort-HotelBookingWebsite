const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const jwtSecret = '1234'; // Use a strong secret in production

// Hardcoded admin credentials
const adminCredentials = {
    username: 'admin',
    password: '1234' // Use the same password you will use in login attempts
};

// Admin login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
        return res.json({ token });
    }

    res.status(400).json({ message: 'Invalid credentials' });
});

// Middleware to check if admin is logged in
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token from "Bearer TOKEN" format

    if (token == null) return res.sendStatus(401); // No token provided

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403); // Token invalid
        req.user = user;
        next();
    });
};

// Example route that requires admin check
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

module.exports = router;
