const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/ScheduleController');

// Create schedule/session
router.post('/', ScheduleController.createSchedule);

// Update schedule
router.put('/:id', ScheduleController.updateSchedule);

// Delete schedule
router.delete('/:id', ScheduleController.deleteSchedule);

// Get schedules by expo
router.get('/expo/:expoId', ScheduleController.getSchedulesByExpo);

// Get single schedule
router.get('/:id', ScheduleController.getScheduleById);

module.exports = router;
