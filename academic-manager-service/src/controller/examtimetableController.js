const ExamTimetable = require('../models/examTimetable');
// const Class = require('../models/Class');
// const Student = require('../models/Student');
const mongoose = require('mongoose'); // Add this import at the top

exports.createExamTimetable = async (req, res) => {
  try {
    
    const { className, term, examName, academicYear, schedule } = req.body;
    // Validate required fields
    if (!className || !examName || !academicYear) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['className', 'examName', 'academicYear']
      });
    }
    // Validate schedule items
    if (!Array.isArray(schedule) || schedule.length === 0) {
      return res.status(400).json({ 
        message: 'Schedule must be a non-empty array' 
      });
    }
   
    const newTimetable = new ExamTimetable({
      className,
      term,
      examName,
      academicYear,
      schedule: schedule.map(item => ({
        date: new Date(item.date),
        subjectName: item.subjectName,
        startTime: item.startTime,
        endTime: item.endTime,
        room: item.room || undefined,
        supervisorName: item.supervisorName || undefined,
        notes: item.notes || undefined
      }))
    });

    const savedTimetable = await newTimetable.save();
    
    res.status(201).json({
      message: 'Exam timetable created successfully',
      timetable: savedTimetable
    });

  } catch (error) {
    console.error('Creation error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};
// Get all exam timetables (admin)
exports.getAllExamTimetables = async (req, res) => {
  try {
    
    // Remove all populate() calls since we're storing names directly
    const timetables = await ExamTimetable.find()
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JS objects
    
    
    // Format dates for better readability
    const formattedTimetables = timetables.map(timetable => ({
      ...timetable,
      schedule: timetable.schedule.map(item => ({
        ...item,
        date: item.date.toISOString().split('T')[0] // Format as YYYY-MM-DD
      }))
    }));

    res.json(formattedTimetables);
  } catch (error) {
    console.error('Error in getAllExamTimetables:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Server error while fetching timetables',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get student's exam timetable
exports.getStudentExamTimetable = async (req, res) => {
  try {
    const timetable = await ExamTimetable.findOne({
      class: req.class,
      published: true
    }).populate('schedule.subject', 'name')
      .populate('schedule.supervisor', 'name');

    if (!timetable) {
      return res.status(404).json({ message: 'No published timetable found for your class' });
    }
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get exam timetable by ID (admin)
exports.getExamTimetableById = async (req, res) => {
  try {
    const timetable = await ExamTimetable.findById(req.params.id);
    
    if (!timetable) {
      return res.status(404).json({ message: 'Exam timetable not found' });
    }

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  // Update exam timetable
  exports.updateExamTimetable = async (req, res) => {
    try {
      const { examName, academicYear, schedule } = req.body;
      
      const updatedTimetable = await ExamTimetable.findByIdAndUpdate(
        req.params.id,
        {
          examName,
          academicYear,
          schedule,
          updatedAt: Date.now()
        },
        { new: true }
      ).populate('class', 'name')
       .populate('schedule.subject', 'name')
       .populate('schedule.supervisor', 'name');
  
      if (!updatedTimetable) {
        return res.status(404).json({ message: 'Exam timetable not found' });
      }
  
      res.json(updatedTimetable);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete exam timetable
  exports.deleteExamTimetable = async (req, res) => {
    try {
      const deletedTimetable = await ExamTimetable.findByIdAndDelete(req.params.id);
  
      if (!deletedTimetable) {
        return res.status(404).json({ message: 'Exam timetable not found' });
      }
  
      res.json({ message: 'Exam timetable deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Publish exam timetable
  exports.publishExamTimetable = async (req, res) => {
    try {
      const timetable = await ExamTimetable.findById(req.params.id);
  
      if (!timetable) {
        return res.status(404).json({ message: 'Exam timetable not found' });
      }
  
      if (timetable.schedule.length === 0) {
        return res.status(400).json({ message: 'Cannot publish empty timetable' });
      }
  
      timetable.published = true;
      timetable.updatedAt = Date.now();
      await timetable.save();
  
      res.json({ 
        message: 'Exam timetable published successfully',
        timetable 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Unpublish exam timetable
  exports.unpublishExamTimetable = async (req, res) => {
    try {
      const timetable = await ExamTimetable.findById(req.params.id);
  
      if (!timetable) {
        return res.status(404).json({ message: 'Exam timetable not found' });
      }
  
      timetable.published = false;
      timetable.updatedAt = Date.now();
      await timetable.save();
  
      res.json({ 
        message: 'Exam timetable unpublished successfully',
        timetable 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get all published exam timetables (for teachers)
// Get published exam timetables
exports.getPublishedExamTimetables = async (req, res) => {
  try {
    const timetables = await ExamTimetable.find({ published: true })
      .sort({ academicYear: -1, examName: 1 });

    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getExamTimetableByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { academicYear } = req.query;
    const query = {
      className: classId,
      published: true
    };

    if (academicYear) {
      query.academicYear = academicYear;
    }

    const timetable = await ExamTimetable.findOne(query)
      .sort({ createdAt: -1 }); // Get most recent
    if (!timetable) {
      return res.status(404).json({ 
        message: academicYear
          ? `No timetable found for ${classId} in ${academicYear}`
          : `No timetable found for ${classId}`
      });
    }

    res.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};


// Get exam timetables by teacher/supervisor/term
exports.getExamTimetablesByTeacher = async (req, res) => {
  try {
    const { supervisorName, academicYear, term } = req.query;

    if (!supervisorName || !supervisorName.trim()) {
      return res.status(400).json({ message: 'supervisorName query param is required' });
    }

    // normalize supervisorName: trim and collapse internal whitespace
    const cleanSupervisor = supervisorName.trim();
    const supervisorParts = cleanSupervisor.split(/\s+/).filter(Boolean);
    if (supervisorParts.length === 0) {
      return res.status(400).json({ message: 'supervisorName is invalid after trimming' });
    }

    // helper to escape regex meta characters
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // build flexible spacing, case-insensitive regex for supervisorName
    const supervisorPattern = '^' + supervisorParts.map(p => escapeRegex(p)).join('\\s+') + '$';
    const supervisorRegex = new RegExp(supervisorPattern, 'i');

    // build term regex if provided (exact, case-insensitive)
    let termFilter = {};
    if (term && term.trim()) {
      const termRegex = new RegExp(`^${escapeRegex(term.trim())}$`, 'i');
      termFilter = { term: termRegex };
    }

    // Base find query (matches inside schedule array for supervisorName)
    const query = {
      published: true,
      ...(academicYear && { academicYear }),
      ...termFilter,
      'schedule.supervisorName': supervisorRegex
    };

   

    let timetables = await ExamTimetable.find(query)
      .sort({ academicYear: 1, examName: 1 });

    // Fallback: explicit unwind + match if nothing was found
    if (timetables.length === 0) {
      const matchStage = {
        published: true,
        ...(academicYear && { academicYear }),
        ...(term && term.trim() && { term: termFilter.term }) // reuse same term regex
      };

      timetables = await ExamTimetable.aggregate([
        { $match: matchStage },
        { $unwind: '$schedule' },
        {
          $match: {
            'schedule.supervisorName': supervisorRegex
          }
        },
        {
          $group: {
            _id: '$_id',
            doc: { $first: '$$ROOT' }
          }
        },
        { $replaceRoot: { newRoot: '$doc' } },
        { $sort: { academicYear: 1, examName: 1 } }
      ]);
    }


    res.json(timetables);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// Get upcoming exams for student
  exports.getUpcomingExams = async (req, res) => {
    try {
      const student = await Student.findById(req.user.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const timetable = await ExamTimetable.findOne({
        class: student.class,
        published: true,
        'schedule.date': { $gte: today }
      }).populate('schedule.subject', 'name')
        .populate('schedule.supervisor', 'name');
  
      if (!timetable) {
        return res.status(404).json({ message: 'No upcoming exams found' });
      }
  
      // Filter only upcoming exams
      const upcomingExams = timetable.schedule.filter(item => {
        const examDate = new Date(item.date);
        return examDate >= today;
      });
  
      res.json({
        examName: timetable.examName,
        academicYear: timetable.academicYear,
        exams: upcomingExams
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };