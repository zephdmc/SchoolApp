const CourseMaterial = require ('../models/Library');
// const Student =require ('../models/Student.js');

// Get materials for logged-in student's class
exports.getMaterials = async (req, res) => {
  try {
    // First get the student's class

    const materials = await CourseMaterial.find({ 
      class: req.user.id 
    })
    .populate('uploadedBy', 'name')
    .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadMaterial = async (req, res) => {
  try {
    const { subject, description, class: className, userId } = req.body;
    
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    // Extract file extension (pdf/doc/ppt) from originalname
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();
    const allowedTypes = ['pdf', 'doc', 'ppt', 'video']; // Add more if needed

    const newMaterial = new CourseMaterial({
      subject,
      description,
      fileUrl: `/uploads/${req.file.filename.replace(/\\/g, '/')}`, // Force forward slashes
      fileType: allowedTypes.includes(fileExt) ? fileExt : 'other', // Save as 'pdf', 'doc', etc.
      fileName: req.file.originalname,
      class: className,
      uploadedBy: userId
    });

    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(500).json({ 
      message: 'Upload failed',
      error: error.message 
    });
  }
};
const path = require('path');
const fs = require('fs');

exports.downloadMaterial = async (req, res) => {
  try {
    const material = await CourseMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    const safeFilename = path.basename(material.fileUrl); // Prevent path traversal
    const filePath = path.join(__dirname, '..', '..', '..', 'uploads', safeFilename);


    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: `File not found at: ${filePath}. Verify the file exists.`
      });
    }

    res.setHeader('Content-Type', material.fileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${material.fileName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Download failed: ' + error.message });
  }
};



// Delete material (admin only)
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await CourseMaterial.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    // TODO: Delete the actual file from storage
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get materials by class ID
exports.getMaterialsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    if (!classId) {
      return res.status(400).json({ message: 'Class ID is required' });
    }

    const materials = await CourseMaterial.find({ 
      class: classId 
    })
    .select('-__v') // Exclude version key
    .populate('class', 'name') // Only populate class if needed
    .sort({ createdAt: -1 })
    .lean(); // Convert to plain JavaScript objects

    // Convert to desired format
    const formattedMaterials = materials.map(material => ({
      ...material,
      uploadedBy: material.uploadedBy.toString(), // Convert ObjectId to string
      class: material.class?._id ? {
        _id: material.class._id.toString(),
        name: material.class.name
      } : material.class
    }));

    res.json(formattedMaterials);
  } catch (error) {
    console.error('Error fetching materials by class:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to fetch materials' 
    });
  }
};


// Get materials uploaded by a specific user
exports.getMaterialsByUploader = async (req, res) => {
  try {
    const uploaderId = req.params.userId;

    const materials = await CourseMaterial.find({ uploadedBy: uploaderId })
      .populate('class', 'fileUrl') // Optional: show class name
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
