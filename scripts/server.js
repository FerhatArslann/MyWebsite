// server.js

// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const ContactMessage = require('./models/ContactMessage');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.set('trust proxy', 1);
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('public'));

// Serve public folder
app.use(express.static(path.join(__dirname, '../public')));
// Serve styles and scripts folders
app.use('/styles', express.static(path.join(__dirname, '../styles')));
app.use('/scripts', express.static(path.join(__dirname, '../scripts')));

// Rate limiter middleware
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 requests per hour
    message: { success: false, error: 'Too many requests, please try again later.' }
});

// Handle POST requests to /api/contact for contact form submissions
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, phone, company, subject, message, website } = req.body;

    // Honeypot spam protection
    if (website) {
        return res.status(400).json({ success: false, error: "Spam detected." });
    }

    // Server-side validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: "Missing required fields." });
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, error: "Invalid email format." });
    }

    try {
        // Save the contact message to the database
        await ContactMessage.create({ name, email, phone, company, subject, message });

        // Configure your email transport using Gmail and credentials from .env
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send the email to your own address with the form details
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `[MyWebsite Contact] ${subject} - ${name}`,
            text: `
You have a new contact form submission from your website:

Name: ${name}
Email: ${email}
Phone: ${phone || ''}
Company: ${company || ''}

Subject: ${subject}

Message:
${message}
`
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start the server on port 3001 - "node scripts/server.js" to run
app.listen(3001, () => console.log('Server running on port 3001'));
