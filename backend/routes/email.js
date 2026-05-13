const express = require('express');
const router = express.Router();
const { sendCustomEmail } = require('../controllers/emailController');
const { protect, authorize } = require('../middleware/auth');

router.post('/send', protect, authorize('hr', 'admin'), sendCustomEmail);

module.exports = router;
