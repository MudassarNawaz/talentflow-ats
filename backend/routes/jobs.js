const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, getJobStats } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Stats route (must be before :id)
router.get('/stats/overview', protect, authorize('hr', 'admin'), getJobStats);

router.route('/')
  .get(getJobs)
  .post(protect, authorize('hr', 'admin'), createJob);

router.route('/:id')
  .get(getJob)
  .put(protect, authorize('hr', 'admin'), updateJob)
  .delete(protect, authorize('hr', 'admin'), deleteJob);

module.exports = router;
