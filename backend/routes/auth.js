const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory storage for users (replace with a database in a real application)
const users = [];

// --- Signup Endpoint ---
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: users.length + 1, email, password: hashedPassword };
        users.push(newUser);

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// --- Login Endpoint ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, email: user.email });

    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;

