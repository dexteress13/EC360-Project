const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Ensure User model is defined
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send("User registered successfully!");
    } catch (error) {
        res.status(400).send("Registration failed.");
    }
});

module.exports = router;
