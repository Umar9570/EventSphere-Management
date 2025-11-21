const express = require("express");
const router = express.Router();
const ScheduleController = require("../controllers/ScheduleController");

// Get all sessions
router.get("/", ScheduleController.getAllSchedules);

// Create a new session
router.post("/", ScheduleController.createSchedule);

// Update a session
router.put("/:id", ScheduleController.updateSchedule);

// Delete a session
router.delete("/:id", ScheduleController.deleteSchedule);

module.exports = router;
