const express = require('express');
const router = express.Router();
const { createInterview, getInterviews, getMyInterviews, updateInterview, deleteInterview } = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('hr', 'admin'), createInterview);
router.get('/', protect, authorize('hr', 'admin'), getInterviews);
router.get('/my', protect, authorize('candidate'), getMyInterviews);
router.put('/:id', protect, authorize('hr', 'admin'), updateInterview);
router.delete('/:id', protect, authorize('hr', 'admin'), deleteInterview);

module.exports = router;
