const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, uploadResume, createUser, getAllUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { uploadProfilePic, uploadResume: uploadResumeMiddleware } = require('../config/cloudinary');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadProfilePic.single('profilePicture'), updateProfile);
router.post('/resume', protect, authorize('candidate'), uploadResumeMiddleware.single('resume'), uploadResume);
router.post('/create-user', protect, authorize('admin'), createUser);
router.get('/users', protect, authorize('admin', 'hr'), getAllUsers);

module.exports = router;
