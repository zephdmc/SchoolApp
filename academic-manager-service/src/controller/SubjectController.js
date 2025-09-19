const subjectService = require('../services/SubjectServices');
const Subject = require('../models/Subjects');

// exports.createSubject = async (req, res) => {
//     try {
//         const subject = await subjectService.createSubject(req.body);
//         res.status(201).json({ message: 'Subject created successfully', subject });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.createSubject = async (req, res) => {
    try {
        console.log("Received data:", req.body); // Debugging log
        const subject = await subjectService.createSubject(req.body);
        res.status(201).json({ message: 'Subject created successfully', subject });
    } catch (error) {
        console.error("Error saving subject:", error); // Log full error
        res.status(500).json({ error: error.message });
    }
};





exports.getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
console.log()
    if (!classId) {
      return res.status(400).json({
        success: false,
        error: "Class ID is required",
      });
    }

    const subjects = await subjectService.getSubjectsByClass(classId);

    if (!subjects || subjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subjects found for this class",
      });
    }

    // ✅ Format based on what getSubjectsByClass2 provides
    const formattedData = subjects.map((subject) => ({
      id: subject._id,
      subjectName: subject.name || "Untitled",
      subjectCode: subject.code || "No Code",
      teacherName: subject.teacher || "Not Assigned",  // manually attached in service
      sessionId: subject.session || null,                  // still an ID
      termId: subject.term || null,                        // still an ID
      classId: subject.class || null,                      // still an ID
    }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching subjects by class:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};



exports.getSubjectsByTeacher = async (req, res) => {
  try {
      console.log('Request query:', req.query);
      const { teacherId } = req.query;
      
      if (!teacherId) {
          return res.status(400).json({ 
              success: false,
              error: "Teacher ID is required as query parameter: /by-teacher?teacherId=ID" 
          });
      }

      const subjects = await Subject.find({ teacher: teacherId });
      
      if (!subjects || subjects.length === 0) {
          return res.status(404).json({
              success: false,
              message: "No subjects found for this teacher"
          });
      }

      res.status(200).json({
          success: true,
          count: subjects.length,
          data: subjects
      });
  } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ 
          success: false,
          error: "Internal Server Error",
          message: error.message 
      });
  }
};



// Add this new method for updating subjects
exports.updateSubject = async (req, res) => {
  const { id } = req.params;
  try {
      const updatedSubject = await subjectService.updateSubject(id, req.body);
      
      if (!updatedSubject) {
          return res.status(404).json({ 
              success: false,
              message: 'Subject not found' 
          });
      }
      
      res.status(200).json({
          success: true,
          message: 'Subject updated successfully',
          data: updatedSubject
      });
  } catch (error) {
      console.error("Error updating subject:", error);
      res.status(500).json({
          success: false,
          message: 'Error updating subject',
          error: error.message
      });
  }
};



exports.getSubjectByName = async (req, res) => {
  try {
    const { name } = req.params;
    const subject = await Subject.find({name: name });
    if (!subject || subject.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


  // Delete a subject
  exports.deleteSubject = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedSubject = await subjectService.deleteSubject(id);
      if (!deletedSubject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      res.status(200).json({ message: 'Subjec deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };




exports.getSubjects = async (req, res) => {
    try {
        const subjects = await subjectService.getSubjects();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//get subject by Id
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
console.log(subject,'subject mi')
    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error("Error fetching subject by ID:", error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};
