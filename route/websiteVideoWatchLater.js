const express = require("express");
const websiteVideoWatchLater = require("../models/websiteVideoWatchLater"); // Adjust the path as necessary
const router = express.Router();

// Create a new video entry
router.post("/", async (req, res) => {
    try {
        const newVideo = await websiteVideoWatchLater.create({
            manualTitle: req.body.manualTitle,
            detectedTitle: req.body.detectedTitle,
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

    // Search by title (manual or detected, case-insensitive)
    if (search) {
        filter.$or = [
            { manualTitle: { $regex: search, $options: "i" } },
            { detectedTitle: { $regex: search, $options: "i" } },
        ];
    }

    // Filter by status if provided
    if (status) {
        filter.status = status;
    }

    try {
        // Sort by addedAt date if specified, otherwise default to descending
        const videos = await websiteVideoWatchLater.find(filter).sort({
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
        const video = await websiteVideoWatchLater.findById(id);
        
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Check if status is being changed to "Watched"
        if (req.body.status === "Watched") {
            await websiteVideoWatchLater.findByIdAndDelete(id); // Delete the video if status is "Watched"
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

// Delete a video by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const video = await websiteVideoWatchLater.findByIdAndDelete(id);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting video", error });
    }
});

module.exports = router;
