const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Configure your email transport (use your real credentials)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Always your authenticated email
            to: process.env.EMAIL_USER,   // Your email
            subject: `[My Website Contact] Message from ${name}`,
            text: `
You have a new contact form submission from your website:

Name: ${name}
Email: ${email}

Message:
${message}
`
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3001, () => console.log('Server running on port 3001'));
