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


exports.getSubjectsByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.query; // Get teacherId from query params

        if (!teacherId) {
            return res.status(400).json({ error: "Teacher ID is required" });
        }

        const subjects = await Subject.find({ teacher: teacherId });

        res.status(200).json(subjects);
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getSubjectByName = async (req, res) => {
  try {
    const { name } = req.params;
    const subject = await Subject.find({name: name });
console.log(name, "not come out");
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
