const express = require('express');
const router = express.Router();
const PasswordResetController = require('../controllers/PasswordResetController');

// Send reset code
router.post('/send-code', PasswordResetController.sendResetCode);

// Verify code
router.post('/verify-code', PasswordResetController.verifyCode);

// Reset password
router.post('/reset-password', PasswordResetController.resetPassword);

// Resend code
router.post('/resend-code', PasswordResetController.resendCode);

module.exports = router;