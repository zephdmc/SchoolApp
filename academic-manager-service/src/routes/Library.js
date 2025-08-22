const express = require('express');
const {
    uploadMaterial,
    getMaterials,
    getMaterialsByClass,
    deleteMaterial,
  getMaterialsByUploader,
  downloadMaterial
} = require  ('../controller/Library');
const multer = require ('multer');

// const upload = multer({ dest: 'uploads/' }); // Temporary storage



const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();


// Add this route
router.get('/download/:id', downloadMaterial);
// Admin routes
router.post('/course-materials', upload.single('file'), uploadMaterial);
router.delete('/:id',  deleteMaterial);
router.get('/uploaded-by/:userId', getMaterialsByUploader);
// Student routes
router.get('/student', getMaterials); // For student's own class
router.get('/class/:classId', getMaterialsByClass); // General class materials

module.exports = router;