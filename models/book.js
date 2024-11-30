// models/Pdf.js
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String,
});

module.exports = mongoose.model('Books', pdfSchema);
