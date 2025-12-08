const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');

// Public route - no authentication required
router.post('/', ContactController.submitContact);

// Admin routes - you can add authentication middleware later
router.get('/', ContactController.getAllContacts);
router.put('/:id', ContactController.updateContactStatus);
router.delete('/:id', ContactController.deleteContact);

module.exports = router;