const express = require('express');
const router = express.Router();
const ExhibitorController = require('../controllers/ExhibitorController');

// Apply as exhibitor
router.post('/apply', ExhibitorController.applyForExpo);

// Get all exhibitors
router.get('/', ExhibitorController.getAllExhibitors);

// Get exhibitors by expo
router.get('/expo/:expoId', ExhibitorController.getExhibitorsByExpo);

// Approve exhibitor
router.put('/approve/:id', ExhibitorController.approveExhibitor);

// Reject exhibitor
router.put('/reject/:id', ExhibitorController.rejectExhibitor);

// Assign booth
router.put('/assign-booth/:id', ExhibitorController.assignBooth);

// Update exhibitor profile
router.put('/:id', ExhibitorController.updateExhibitorProfile);

module.exports = router;
