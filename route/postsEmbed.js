const express = require('express');
const router = express.Router();
const InstagramPost = require('../models/postsEmbed');

// Route to add a new Instagram post
router.post('/add', async (req, res) => {
  const { postUrl, category, user, aboutIt } = req.body;

  try {
    const newPost = new InstagramPost({
      postUrl,
      category,
      aboutIt,
      user,
    });

    await newPost.save();
    res.status(201).json({ message: 'Post added successfully!', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch posts based on user, keywords, or category
router.get('/', async (req, res) => {
  const { user, keyword, category } = req.query;

  try {
    // Build the query dynamically based on which filters are provided
    const query = {};

    if (user) query.user = user; // Filter by user
    if (category) query.category = category; // Filter by category

    const posts = await InstagramPost.find(query);

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    res.status(200).json(posts); // Return the filtered posts
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
