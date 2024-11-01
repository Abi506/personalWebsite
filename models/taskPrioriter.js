const mongoose = require("mongoose");

// Define the task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    priority: {
        type: Number,
        required: true,
        min: 1, // Minimum priority value
        max: 100, // Maximum priority value
    },
    date: {
        type: Date,
        default: Date.now, // Default to the current date
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "7d", // Automatically delete the task after one week
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
    },
});

// Create the task model
const TaskPrioriter = mongoose.model("TaskPrioriter", taskSchema);

module.exports = TaskPrioriter;
