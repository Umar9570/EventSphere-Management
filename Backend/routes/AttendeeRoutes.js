const express = require("express");
const router = express.Router();
const AttendeeController = require("../controllers/AttendeeController");

// Get all attendees
router.get("/", AttendeeController.getAllAttendees);

// Get attendees by expo
router.get("/expo/:expoId", AttendeeController.getAttendeesByExpo);

// Get attendee by ID
router.get("/:id", AttendeeController.getAttendeeById);

// Update attendee
router.put("/:id", AttendeeController.updateAttendee);

// Delete attendee
router.delete("/:id", AttendeeController.deleteAttendee);

// Mark attendance (QR)
router.post("/attendance", AttendeeController.markAttendance);

module.exports = router;
