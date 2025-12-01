const express = require('express');
const router = express.Router();
const ExpoController = require('../controllers/ExpoController');

// Create expo
router.post('/', ExpoController.createExpo);

// Update expo
router.put('/:id', ExpoController.updateExpo);

// Delete expo
router.delete('/:id', ExpoController.deleteExpo);

router.get('/approved-expo/:userId', ExpoController.getApprovedExpo);
// Get all expos
router.get('/', ExpoController.getAllExpos);

// Get expo by ID
router.get('/:id', ExpoController.getExpoById);

router.get('/all-for-organizer/:userId', ExpoController.getAllForOrganizer);

// Update booth count
router.put('/:id/booths', ExpoController.updateBoothCount);


module.exports = router;
