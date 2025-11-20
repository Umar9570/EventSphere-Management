const express = require('express');
const router = express.Router();
const AttendeeController = require('../controllers/AttendeeController');

// Get all attendees
router.get('/', AttendeeController.getAllAttendees);

// Get attendee by ID
router.get('/:id', AttendeeController.getAttendeeById);

// Get attendees by expo
router.get('/expo/:expoId', AttendeeController.getAttendeesByExpo);

// Update attendee
router.put('/:id', AttendeeController.updateAttendee);

// Mark attendance via QR
router.post('/attendance', AttendeeController.markAttendance);

module.exports = router;
