const Contact = require("../models/contact");
const express = require("express");
const router = express.Router(); 

// Create a new contact
router.post("/", async (req, res) => { 
    const name=req.body.name
    try {
        const responseDb = await Contact.create({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            vipConnections: req.body.vipConnections,
            groups: req.body.groups 
        });
        res.status(201).send(responseDb); // Return 201 for successful creation
    } catch (error) {
        console.log(error);
        res.status(500).send(error); 
    }
});

// Get all contacts
router.get("/", async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.send(contacts);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Search contacts by name or phone number
router.get("/search", async (req, res) => {
    const { query } = req; // Extract query parameters

    try {
        const searchCriteria = {
            $or: [
                { name: { $regex: query.name || "", $options: "i" } }, // Case-insensitive search
                { phoneNumber: { $regex: query.phoneNumber || "", $options: "i" } }
            ]
        };
        
        const contacts = await Contact.find(searchCriteria);
        res.send(contacts);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Get contacts by groups
router.get("/groups/:groupName", async (req, res) => {
    const { groupName } = req.params;

    try {
        const contacts = await Contact.find({ groups: groupName });
        res.send(contacts);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Get contacts based on VIP connections
router.get("/vip", async (req, res) => {
    const { isVip } = req.query; // Expecting a query parameter to indicate if searching for VIP connections

    try {
        const contacts = await Contact.find({ vipConnections: isVip === 'true' });
        res.send(contacts);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Update a contact by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                vipConnections: req.body.vipConnections,
                groups: req.body.groups 
            },
            { new: true } // Return the updated document
        );

        if (!updatedContact) {
            return res.status(404).send({ message: "Contact not found" });
        }

        res.send(updatedContact);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Delete a contact by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).send({ message: "Contact not found" });
        }

        res.send({ message: "Contact deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;
