// models/Newsletter.js

const mongoose = require('mongoose');
const NewsletterSchema = new mongoose.Schema({
    email: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Newsletter', NewsletterSchema);
