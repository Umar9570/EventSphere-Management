const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// ---------------- REGISTER ROUTES ----------------
router.post('/register/attendee', AuthController.registerAttendee);
router.post('/register/exhibitor', AuthController.registerExhibitor);
router.post('/register/organizer', AuthController.createOrganizer); // Admin only in frontend logic

// ---------------- LOGIN ----------------
router.post('/login', AuthController.login);

// ---------------- UPDATE USER ----------------
router.put('/:id', AuthController.updateUser);

// ---------------- DELETE USER ----------------
router.delete('/:id', AuthController.deleteUser);

// ---------------- GET USERS BY ROLE ----------------
router.get('/role/:role', AuthController.getUsersByRole);

router.get('/users/count', AuthController.getUsersCount);

module.exports = router;
