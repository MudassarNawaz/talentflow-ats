const express = require('express');
const router = express.Router();
const { getBranches, getBranch, createBranch, updateBranch, deleteBranch } = require('../controllers/branchController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getBranches)
  .post(protect, authorize('admin'), createBranch);

router.route('/:id')
  .get(getBranch)
  .put(protect, authorize('admin'), updateBranch)
  .delete(protect, authorize('admin'), deleteBranch);

module.exports = router;
