const Timetable = require('../models/Timetable');

// Create timetable
exports.createTimetable = async (req, res) => {
  try {
    const { class: className, term, day, date, periods } = req.body;
    // Check if timetable already exists for this class and day
    const existingTimetable = await Timetable.findOne({ class: className, day });
    if (existingTimetable) {
      return res.status(400).json({ message: 'Timetable for this class and day already exists' });
    }

    const timetable = new Timetable({
      class: className,
      term,
      day,
      date: new Date(date),
      periods
    });

    await timetable.save();
    res.status(201).json({ message: 'Timetable created successfully', timetable });
  } catch (error) {
    res.status(500).json({ message: 'Error creating timetable', error: error.message });
  }
};


// Get timetables by class and academic year
exports.getTimetablesByClassAndYear = async (req, res) => {
  try {
    const { class: className, academicYear } = req.query;
    
    if (!className || !academicYear) {
      return res.status(400).json({ message: 'Class and academic year are required' });
    }

    // Parse academic year (format: "2023-2024")
    const [startYear, endYear] = academicYear.split('-').map(Number);
    const startDate = new Date(startYear, 0, 1); // January 1 of start year
    const endDate = new Date(endYear, 11, 31); // December 31 of end year

    const timetables = await Timetable.find({
      class: className,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ day: 1, 'periods.startTime': 1 });

    if (!timetables.length) {
      return res.status(404).json({ message: 'No timetables found for the selected class and academic year' });
    }

    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetables', error: error.message });
  }
};

// Get all timetables
exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find().sort({ class: 1, day: 1 });
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetables', error: error.message });
  }
};

// Get timetable by ID
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable', error: error.message });
  }
};

// Update timetable
exports.updateTimetable = async (req, res) => {
  try {
    const { class: className, day, date, periods } = req.body;
    
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      {
        class: className,
        day,
        date: new Date(date),
        periods
      },
      { new: true }
    );

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.status(200).json({ message: 'Timetable updated successfully', timetable });
  } catch (error) {
    res.status(500).json({ message: 'Error updating timetable', error: error.message });
  }
};

// Delete timetable
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting timetable', error: error.message });
  }
};



exports.getStudentTimetable = async (req, res) => {
  try {
      // Get student's class from query parameter
      const { class: className } = req.query;
      if (!className) {
          return res.status(400).json({ message: 'Class parameter is required' });
      }

      // Get current day name
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = new Date();
      const dayName = days[today.getDay()];

      // Debugging logs
   
      // Get timetable for student's class and today's day
      const timetable = await Timetable.findOne({ 
          class: className.trim(), // Ensure whitespace is trimmed
          day: dayName,
          date: { $lte: new Date() } // Only get today or past timetables
      }).sort({ date: -1 }); // Get the most recent one

      if (!timetable) {
         
          return res.status(404).json({ 
              message: 'Timetable not found for your class today',
              debug: {
                  className: className,
                  dayName: dayName,
                  currentDate: new Date()
              }
          });
      }

      res.status(200).json(timetable);
  } catch (error) {
      console.error('Error in getStudentTimetable:', error);
      res.status(500).json({ 
          message: 'Error fetching timetable', 
          error: error.message 
      });
  }
};

// Get weekly timetable for student
exports.getWeeklyTimetable = async (req, res) => {
  try {
   
        // Get student's class from query parameter
        const { class: className } = req.query;
     
        if (!className) {
            return res.status(400).json({ message: 'Class parameter is required' });
        }
   
        // Get all timetables for student's class
        const timetables = await Timetable.find({ class: className }).sort({ day: 1 });

        if (!timetables || timetables.length === 0) {
            return res.status(404).json({ message: 'No timetables found for your class' });
        }

        res.status(200).json(timetables);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching weekly timetable', 
            error: error.message 
        });
    }
};


// Get timetables by class and term
exports.getTimetablesByClassAndTerm = async (req, res) => {
  try {
    const { class: className, term } = req.query;
console.log(term, className, 'sotolo' )
    if (!className || !term) {
      return res.status(400).json({ message: 'Class and term are required' });
    }

    const timetables = await Timetable.find({
      class: className.trim(),
      term: term.trim()
    }).sort({ day: 1, 'periods.startTime': 1 });

    if (!timetables || timetables.length === 0) {
      return res.status(404).json({ message: 'No timetables found for this class and term' });
    }

    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetables', error: error.message });
  }
};


