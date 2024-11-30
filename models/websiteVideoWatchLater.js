const mongoose = require("mongoose");

// Define the watch-later schema
const websiteVideoWatchLaterSchema = new mongoose.Schema({
    manualTitle: {
        type: String,
        trim: true, // Manually entered title by the user
    },
    detectedTitle: {
        type: String,
        trim: true, // Automatically detected title during metadata fetch
    },
    url: {
        type: String,
        required: true,
        match: [
            /(http|https):\/\/([\w.-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/,
            "Please enter a valid video URL",
        ],
    },
    addedAt: {
        type: Date,
        default: Date.now, // Automatically records when the video is added
    },
    status: {
        type: String,
        enum: ["Pending", "Watched"],
        default: "Pending", // Tracks whether the video has been watched
    },
});

// Middleware to delete the document when status changes to "Watched"
websiteVideoWatchLaterSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "Watched") {
        this.remove(); // Remove the document if marked as "Watched"
    }
    next();
});

// Create the watch-later model
const websiteVideoWatchLater = mongoose.model("websiteVideoWatchLater", websiteVideoWatchLaterSchema);

module.exports = websiteVideoWatchLater;
