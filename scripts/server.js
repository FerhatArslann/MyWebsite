// server.js

// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Handle POST requests to /api/contact for contact form submissions
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Configure your email transport using Gmail and credentials from .env
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        // Send the email to your own address with the form details
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Always your authenticated email
            to: process.env.EMAIL_USER,   // Your email
            subject: `[MyWebsite Contact] Message from ${name}`,
            text: `
You have a new contact form submission from your website:

Name: ${name}
Email: ${email}

Message:
${message}
`
        });
        // Respond with success if email sent
        res.json({ success: true });
    } catch (err) {
        // Respond with error if sending fails
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start the server on port 3001 - "node scripts/server.js" to run
app.listen(3001, () => console.log('Server running on port 3001'));
