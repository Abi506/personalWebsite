const mongoose = require("mongoose");

// Define the watch-later schema
const watchLaterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
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
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["Pending", "Watched"],
        default: "Pending",
    },
});

// Middleware to delete the document when status changes to "Watched"
watchLaterSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "Watched") {
        this.remove(); // Remove the document if marked as "Watched"
    }
    next();
});

// Create the watch-later model
const videoWatchLater = mongoose.model("videoWatchLater", watchLaterSchema);

module.exports = videoWatchLater;
