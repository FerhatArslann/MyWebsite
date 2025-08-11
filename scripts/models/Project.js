// models/Project.js

const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    tags: [String],
    link: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Project', ProjectSchema);
