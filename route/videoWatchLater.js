const express = require("express");
const VideoWatchLater = require("../models/videoWatchLater"); // Adjust the path as necessary
const router = express.Router();

// Create a new video entry
router.post("/", async (req, res) => {
    try {
        const newVideo = await VideoWatchLater.create({
            title: req.body.title,
            url: req.body.url,
        });
        res.status(201).json(newVideo); // Return the created video entry
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding video to watch later", error });
    }
});

// Get videos with search, sort, and filter options
router.get("/", async (req, res) => {
    const { search, status, sort } = req.query;
    const filter = {};

    // Search by title (case-insensitive)
    if (search) {
        filter.title = { $regex: search, $options: "i" };
    }

    // Filter by status if provided
    if (status) {
        filter.status = status;
    }

    try {
        // Sort by addedAt date if specified, otherwise default to descending
        const videos = await VideoWatchLater.find(filter).sort({
            addedAt: sort === "asc" ? 1 : -1,
        });

        res.json(videos); // Return the filtered, sorted videos
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving watch later videos", error });
    }
});

// Update video status by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the video document
        const video = await VideoWatchLater.findById(id);
        
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        
        // Check if status is being changed to "Watched"
        if (req.body.status === "Watched") {
            await VideoWatchLater.findByIdAndDelete(id); // Delete the video if status is "Watched"
            return res.status(200).json({ message: "Video marked as watched and deleted" });
        } else {
            // Otherwise, update the status to the provided value
            video.status = req.body.status;
            await video.save();
            return res.json(video); // Return the updated video entry
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating video status", error });
    }
});

module.exports = router;
