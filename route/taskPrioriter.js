const express = require("express");
const TaskPrioriter = require("../models/taskPrioriter"); // Adjust the path as necessary
const router = express.Router();

// Create a new task
router.post("/", async (req, res) => {
    console.log(req.body.date,'client date')
    const tempDate=new Date(req.body.date)
    console.log(tempDate)
    try {
        const newTask = await TaskPrioriter.create({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            date: new Date(req.body.date), // Accept a date from the client
        });
        res.status(201).json(newTask); // Return the created task
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating task", error });
    }
});

// Get tasks by date, sorted by priority
router.get("/:date", async (req, res) => {
    const { date } = req.params;

    // Convert the date string to a Date object
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Set the end date to the next day

    try {
        const tasks = await TaskPrioriter.find({
            date: { $gte: startDate, $lt: endDate }, // Find tasks within the same day
        }).sort({ priority: -1 }); // Sort tasks by priority in descending order
        res.json(tasks); // Return the tasks for that day
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving tasks", error });
    }
});

// Update a task by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const updatedTask = await TaskPrioriter.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                description: req.body.description,
                priority: req.body.priority,
                date: new Date(req.body.date), // Update the date if provided
                status: req.body.status, // Optional: Update status if provided
            },
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(updatedTask); // Return the updated task
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating task", error });
    }
});

// Delete a task by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await TaskPrioriter.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" }); // Confirmation message
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting task", error });
    }
});

module.exports = router;
