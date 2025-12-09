const express = require('express');
const router = express.Router();
const EventRegistrationController = require('../controllers/EventRegistrationController');

// Register for event
router.post('/register', EventRegistrationController.registerForEvent);

// Mark attendance via QR code
router.post('/mark-attendance', EventRegistrationController.markAttendance);

// Get user registrations
router.get('/user/:userId', EventRegistrationController.getUserRegistrations);

// Check registration status
router.get('/check/:userId/:expoId', EventRegistrationController.checkRegistrationStatus);

router.get('/all', EventRegistrationController.getAllRegistrations);

module.exports = router;