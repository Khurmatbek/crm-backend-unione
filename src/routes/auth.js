const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ==================== Register ====================
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "Iltimos, barcha maydonlarni to'ldiring" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: "Bu email allaqachon ro'yxatdan o'tgan" });
        }

        let role = 'student'; // default
        if (email === 'unione_super_admin@gmail.com') role = 'admin';
        else if (email === 'teacher_unione@gmail.com') role = 'teacher';
        const user = await User.create({
            name,
            email,
            password: password,
            role
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({ success: true, token, user: userResponse });
    } catch (err) {
        next(err);
    }
});

// ==================== Login ====================
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email va parolni kiriting" });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ success: false, error: "Foydalanuvchi topilmadi" });
        }

        // const isMatch = await bcrypt.compare(password, user.password);

        const isMatch = await user.matchPassword(password);
        
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Noto'g'ri parol kiritdingiz" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const userResponse = user.toObject();
        delete userResponse.password;

        // Javob
        res.json({ success: true, token, user: userResponse });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
