const Result = require("../models/examRecord");
const axios = require("axios");


// Fetch results by class and subject
exports.getResults = async (req, res) => {
  try {
    const { class: classSelected, subject } = req.query;


    const results = await Result.find({ class: classSelected, subject }).populate("student_id", "first_name last_name");
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
};

// Approve result
exports.approveResult = async (req, res) => {
  try {
    const { id } = req.params;
    await Result.findByIdAndUpdate(id, { status: "approved" });
    res.status(200).json({ message: "Result approved successfully" });
  } catch (error) {
    console.error("Error approving result:", error);
    res.status(500).json({ error: "Failed to approve result" });
  }
};



exports.getResultsByClassAndSubject = async (req, res) => {
  try {
    const { classSelected, subject } = req.query;



    if (!classSelected || !subject) {
      return res.status(407).json({ message: "Class and subject are required" });
    }
    // Fetch results based on class and subject
    const results = await Result.find({  classSelected, subject }).lean();
    // If no results exist, return an empty array
    if (!results.length) {
      return res.json([]);
    }
    // Extract student IDs from results
    const studentID = results.map(result => result.student_id);
    // Call Users Microservice to fetch student details
    const userServiceURL = process.env.USER_SERVICE_URL || "https://schoolapp-nau2.onrender.com/user/api/student/student-by-ids";
    let studentMap = {}; // Default empty object
    try {
      const studentResponse = await axios.post(userServiceURL, { studentIds: studentID});
      if (!Array.isArray(studentResponse.data)) {
        throw new Error("Invalid student data format");
      }
      studentMap = studentResponse.data.reduce((acc, student) => {
        acc[student.studentID] = student;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error fetching student details:", error);
      return res.status(500).json({ message: "Failed to fetch student details" });
    }
    // Attach student details to each result
    const resultsWithStudents = results.map(result => ({
      ...result,
      student: studentMap[result.student_id] || { admissionNumber: "N/A", firstName: "Unknown", lastName: "Student" },
    }));
    res.json(resultsWithStudents);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.saveResults = async (req, res) => {
  try {
    const { classSelected, subject, scores, teacher_id, term_id } = req.body;

    if (!classSelected || !subject || !scores || !teacher_id || !term_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const results = await Promise.all(
      Object.keys(scores).map(async (studentId) => {
        const { assignments, test1, test2, test3, exam } = scores[studentId];
        const total_score = (assignments || 0) + (test1 || 0) + (test2 || 0) + (test3 || 0) + (exam || 0);

        let result = await Result.findOne({ student_id: studentId, classSelected, subject, term_id });

        if (result) {
          // Update existing result
          result.assignments = assignments;
          result.test1 = test1;
          result.test2 = test2;
          result.test3 = test3;
          result.exam = exam;
          result.total_score = total_score;
          await result.save();
        } else {
          // Create new result
          result = new Result({
            student_id: studentId,
            classSelected,
            teacher_id,
            subject,
            assignments,
            test1,
            test2,
            test3,
            exam,
            total_score,
            status: "pending",
            term_id
          });
          await result.save();
        }

        return result;
      })
    );

    res.json({ message: "Results saved successfully", results });
  } catch (error) {
    console.error("Error saving results:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const Computation = require('../models/examComputation');

exports.getStudentResults = async (req, res) => {
    try {
        const { studentId, classId, termId } = req.params;
        // Fetch all results for the given student, class, and term
        const results = await Result.find({
            student_id: studentId,
            classSelected: classId,
            term_id: termId,
            // status: "approved",
        });

        if (!results.length) {
            return res.status(404).json({ message: 'No results found for this student.' });
        }

        // Compute total score
        const totalScore = results.reduce((sum, result) => sum + result.total_score, 0);

        // Get the grading criteria from the Computation model
        const computation = await Computation.findOne({ class: classId, term: termId });

        if (!computation) {
            return res.status(404).json({ message: 'Computation data not found for this class and term.' });
        }

        // Determine grade and comment based on computation model
        let grade = 'F';
        let comment = 'Needs improvement';

        if (totalScore >= computation.score) {
            grade = computation.grade;
            comment = computation.comment;
        }

        res.status(200).json({
            results,
            totalScore,
            grade,
            comment,
        });

    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'Server error' });
    }
};




exports.getPendingResults = async (req, res) => {
    try {
        const { term_id, classSelected } = req.query;
        // Fetch pending results
        const pendingResults = await Result.find({ term_id, classSelected, status: "pending" }).lean();
        if (!pendingResults.length) {
            return res.status(404).json({ message: "No pending results found" });
        }
        // Extract student IDs
        const studentIDs = pendingResults.map(result => result.student_id);
        // Fetch student details from User Microservice
        const userServiceURL = process.env.USER_SERVICE_URL || "https://schoolapp-nau2.onrender.com/user/api/student/student-by-ids";
        let studentMap = {}; // Default empty object
        try {
            const studentResponse = await axios.post(userServiceURL, { studentIds: studentIDs });

            if (!Array.isArray(studentResponse.data)) {
                throw new Error("Invalid student data format");
            }
            studentMap = studentResponse.data.reduce((acc, student) => {
                acc[student.studentID] = student; // Assuming student ID is `_id`
                return acc;
            }, {});
        } catch (error) {
            console.error("Error fetching student details:", error);
            return res.status(500).json({ message: "Failed to fetch student details" });
        }
        // Attach student details to pending results
        const formattedResults = pendingResults.map(result => ({
            _id: result._id,
            studentID: result.student_id,
            name: studentMap[result.student_id]
                ? `${studentMap[result.student_id].firstName} ${studentMap[result.student_id].lastName}`
                : "Unknown Student",
            status: result.status
        }));

        res.status(200).json(formattedResults);
    } catch (error) {
        console.error("Error fetching pending results:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// // Update all results for a selected term to approved or pending
// exports.updateResultsStatus = async (req, res) => {
//     try {
//         const { term_id, classSelected, status } = req.body;
// console.log(term_id, classSelected, status, "da")
//         if (!['approved', 'pending'].includes(status)) {
//             return res.status(400).json({ message: 'Invalid status value' });
//         }
//         const updatedResults = await Result.updateMany({ term_id, classSelected }, { status });
//         res.status(200).json({ message: `Updated ${updatedResults.modifiedCount} results to ${status}` });
//     } catch (error) {
//         console.error('Error updating results:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };




// Update result status for all students in a selected term and class
exports.updateResultsStatus = async (req, res) => {
    const { termId, classSelected, newStatus } = req.body;
    if (!termId || !classSelected || !newStatus) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const updated = await Result.updateMany(
            { term_id: termId, classSelected: classSelected },
            { $set: { status: newStatus } }
        );

        if (updated.modifiedCount === 0) {
            return res.status(404).json({ message: 'No matching results found' });
        }

        res.json({
            message: 'Results updated successfully',
            updatedCount: updated.modifiedCount,
        });
    } catch (error) {
        console.error('Error updating results:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Add this to your controller (examRecord.js)
exports.updateSingleResultStatus = async (req, res) => {
  try {
      const { studentId, termId, classSelected, status } = req.body;
      console.log(studentId,'djd')
      if (!studentId || !termId || !classSelected || !status) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      const updated = await Result.updateMany(
          { 
              student_id: studentId, 
              term_id: termId, 
              classSelected: classSelected 
          },
          { $set: { status: status } }
      );

      if (updated.modifiedCount === 0) {
          return res.status(404).json({ message: 'No matching results found' });
      }

      res.json({
          message: 'Student results updated successfully',
          updatedCount: updated.modifiedCount,
      });
  } catch (error) {
      console.error('Error updating student results:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Add this new controller method
exports.getStudentPendingResults = async (req, res) => {
  try {
      const { studentId, termId, classId } = req.params;
      
      // Fetch all pending results for the student
      const results = await Result.find({
          student_id: studentId,
          term_id: termId,
          classSelected: classId,
          status: "pending"
      });

      if (!results.length) {
          return res.status(404).json({ message: 'No pending results found for this student.' });
      }

      // Get student details
      const userServiceURL = process.env.USER_SERVICE_URL || "https://schoolapp-nau2.onrender.com/user/api/student/student-by-ids";
      const studentResponse = await axios.post(userServiceURL, { studentIds: [studentId] });
      const student = studentResponse.data[0] || {};

      res.status(200).json({
          student: {
              name: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
              admissionNumber: student.admissionNumber,
              ...student
          },
          results
      });

  } catch (error) {
      console.error('Error fetching student pending results:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Update this existing method to handle subject-level approval
exports.updateSingleResultStatus = async (req, res) => {
  try {
      const { resultId, status } = req.body;

      if (!resultId || !status) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      const updated = await Result.findByIdAndUpdate(
          resultId,
          { $set: { status: status } },
          { new: true }
      );

      if (!updated) {
          return res.status(404).json({ message: 'Result not found' });
      }

      res.json({
          message: 'Result updated successfully',
          updatedResult: updated
      });
  } catch (error) {
      console.error('Error updating result:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getAllStudentsInClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { term_id } = req.query;
    
    // Ensure USER_SERVICE_URL is properly set
    const userServiceBase = process.env.USER_SERVICE_URL || 'https://schoolapp-nau2.onrender.com/user';
    const userServiceURL = `${userServiceBase}/api/students/class/${classId}`;
    
    const response = await axios.get(userServiceURL);
    const students = Array.isArray(response.data) ? response.data : [];

    if (term_id) {
      const studentsWithStatus = await Promise.all(
        students.map(async (student) => {
          const results = await Result.find({
            student_id: student.studentID || student._id,
            term_id,
            classSelected: classId
          });

          return {
            ...student,
            name: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
            status: results.length
              ? (results.every(r => r.status === 'approved') ? 'approved' : 'pending')
              : 'no-results'
          };
        })
      );
      return res.status(200).json(studentsWithStatus);
    }

    res.status(200).json(
      students.map(student => ({
        ...student,
        name: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
        status: 'unknown'
      }))
    );

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json([]);
  }
};
