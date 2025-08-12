// server.js

// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const ContactMessage = require('./models/ContactMessage');
const Project = require('./models/Project');

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Handle POST requests to /api/contact for contact form submissions
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, company, subject, message } = req.body;

    // Only require fields that have asterisk (required): name, email, subject, message
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: "Missing required fields." });
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

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new project
app.post('/api/projects', async (req, res) => {
    const { title, description, imageUrl, tags, link } = req.body;
    try {
        const project = await Project.create({ title, description, imageUrl, tags, link });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit a project
app.put('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server on port 3001 - "node scripts/server.js" to run
app.listen(3001, () => console.log('Server running on port 3001'));
