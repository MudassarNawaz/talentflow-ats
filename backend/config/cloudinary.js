const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for resumes (PDF)
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ats/resumes',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
    public_id: (req, file) => `resume_${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, '')}`,
  },
});

// Storage for cover letters (PDF/DOCX)
const coverLetterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ats/cover-letters',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'docx', 'doc'],
    public_id: (req, file) => `cover_${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, '')}`,
  },
});

// Storage for profile pictures
const profilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ats/profile-pics',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    public_id: (req, file) => `profile_${Date.now()}`,
  },
});

const uploadResume = multer({ storage: resumeStorage });
const uploadCoverLetter = multer({ storage: coverLetterStorage });
const uploadProfilePic = multer({ storage: profilePicStorage });

module.exports = {
  cloudinary,
  uploadResume,
  uploadCoverLetter,
  uploadProfilePic,
};
