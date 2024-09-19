const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Event = require('../models/Event');
const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required.');

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token.');
        req.userId = decoded.id; // Extract user ID from token
        next();
    });
};
// Multer configuration for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Route to get events created by the logged-in user
router.get('/my-events', verifyToken, async (req, res) => {
    try {
        const events = await Event.find({ creator: req.userId })
            .populate('attendees', 'username email') // Populate attendees
            .populate('creator', 'username email');
        res.status(200).json(events);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Create event route
router.post('/create', verifyToken, upload.single('image'), async (req, res) => {
    const { title, description, date, location, maxAttendees } = req.body;

    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            maxAttendees,
            creator: req.userId, // Set the user ID as the creator
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('creator', 'username email');
        res.json(events);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('creator', 'username email');
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Update event
router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, date, location, maxAttendees } = req.body;

    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (event.creator.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Check if the new maxAttendees is less than the current number of attendees
        if (maxAttendees < event.attendees.length) {
            return res.status(400).json({
                error: `Cannot set max attendees to less than the current number of attendees (${event.attendees.length}).`
            });
        }

        // Proceed with updating the event if all validations pass
        event.title = title;
        event.description = description;
        event.date = date;
        event.location = location;
        event.maxAttendees = maxAttendees;

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Delete event
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        // Check if the event creator is the logged-in user
        if (event.creator.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add attendee (RSVP to event)
router.post('/:id/rsvp', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        // Check if the user is already attending
        if (event.attendees.includes(req.userId)) {
            return res.status(400).json({ error: 'You have already RSVPed to this event.' });
        }

        // Check if max attendees limit is reached
        if (event.attendees.length >= event.maxAttendees) {
            return res.status(400).json({ error: 'Maximum attendees limit reached.' });
        }

        // Add the user to the attendees list
        event.attendees.push(req.userId);

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;
