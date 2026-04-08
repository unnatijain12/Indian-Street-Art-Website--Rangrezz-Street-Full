const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Message = require('../models/Message');

// ===============================
// MULTER — FILE UPLOAD SETUP
// ===============================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));  // save to backend/uploads/
    },
    filename: function (req, file, cb) {
        // rename file to avoid conflicts: timestamp + original name
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// Only allow JPG and PNG files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPG and PNG files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB max
    fileFilter: fileFilter
});

// ===============================
// POST /api/contact — Save form
// ===============================

router.post('/', upload.single('artwork'), async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create new message document
        const newMessage = new Message({
            name,
            email,
            subject,
            message,
            artwork: req.file ? req.file.filename : null  // save filename if uploaded
        });

        await newMessage.save();

        res.status(201).json({ success: true, message: 'Message saved successfully!' });

    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ===============================
// GET /api/contact — Admin: get all messages
// ===============================

router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }); // newest first
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// ===============================
// DELETE /api/contact/:id — Admin: delete a message
// ===============================

router.delete('/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Message deleted.' });
    } catch (err) {
        console.error('Error deleting message:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;