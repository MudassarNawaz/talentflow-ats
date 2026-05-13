const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getAllApplications, getApplication, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { uploadResume } = require('../config/cloudinary');

router.post('/', protect, authorize('candidate'), uploadResume.single('resume'), applyForJob);
router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/', protect, authorize('hr', 'admin'), getAllApplications);
router.get('/:id', protect, getApplication);
router.put('/:id/status', protect, authorize('hr', 'admin'), updateApplicationStatus);

module.exports = router;
