// routes/blogRoutes.js
const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();

// 1. Add a new blog
router.post('/add', async (req, res) => {
  try {
    const { title, link } = req.body;

    // Create a new blog entry
    const newBlog = new Blog({
      title,
      link,
    });

    // Save the new blog
    await newBlog.save();
    res.status(201).json(newBlog); // Send back the created blog
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find(); // Get all blogs from the database
    res.status(200).json(blogs); // Send back the list of blogs
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Get a single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id); // Find a blog by its ID
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog); // Send back the blog data
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// 5. Delete a blog
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id); // Delete the blog by its ID
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
