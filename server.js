const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

// Allow frontend (HTML files) to talk to this backend
app.use(cors());

// Parse incoming JSON data
app.use(express.json());

// Parse form data (text fields)
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
// e.g. http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===============================
// DATABASE CONNECTION
// ===============================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // stop the server if DB fails
    });

// ===============================
// ROUTES
// ===============================

const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

// Test route — open http://localhost:5000/ in browser to check
app.get('/', (req, res) => {
    res.send('Rangrezz Street Backend is Running!');
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});