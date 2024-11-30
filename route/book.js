const express = require('express');
const multer = require('multer');
const Book = require('../models/book'); // Ensure your schema is set correctly
const router = express.Router();

// Configure multer for PDF upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        // Delete the previous PDF if it exists
        await Book.deleteMany();

        // Create a new PDF entry
        const pdf = new Book({
            data: req.file.buffer,
            contentType: 'application/pdf', // Set contentType explicitly to 'application/pdf'
        });
        await pdf.save();

        res.status(200).json({ message: 'PDF uploaded successfully!' });
    } catch (error) {
        console.error('Error uploading PDF:', error); // Logging the error
        res.status(500).json({ error: 'Failed to upload PDF' });
    }
});

// Route to fetch the PDF
router.get('/get-pdf', async (req, res) => {
    try {
        const pdf = await Book.findOne();
        if (!pdf) {
            console.error('No PDF found in the database');
            return res.status(404).json({ error: 'No PDF found' });
        }
        res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');

    // Send the PDF data
    res.send(pdf.data);
    } catch (error) {
        console.error('Error retrieving PDF:', error); // Logging the error
        res.status(500).json({ error: 'Failed to retrieve PDF' });
    }
});

module.exports = router;
