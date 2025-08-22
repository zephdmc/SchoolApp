const CalendarEvent = require('../models/calendarEventt');

exports.createEvent = async (req, res) => {
    // Enhanced validation
    const requiredFields = {
      title: 'string',
      startDate: 'date',
      endDate: 'date',
      eventType: 'string'
    };
  
    const errors = [];
    
    // Check required fields
    Object.entries(requiredFields).forEach(([field, type]) => {
      if (!req.body[field]) {
        errors.push(`${field} is required`);
      } else if (type === 'date' && isNaN(new Date(req.body[field]))) {
        errors.push(`${field} must be a valid date`);
      }
    });
  
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors
      });
    }
  
    try {
      const eventData = {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
      };
  
      const event = new CalendarEvent(eventData);
      await event.save();
      
      res.status(201).json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Database error:', error);
      
      if (error.name === 'ValidationError') {
        const mongooseErrors = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({
          message: 'Database validation failed',
          errors: mongooseErrors
        });
      }
      
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  };

exports.getStudentEvents = async (req, res) => {
  try {
    // Get student's class if needed for specific events
    const studentClass = req.user.class; // Assuming user has class info
    
    const events = await CalendarEvent.find({
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'students' },
        { 
          targetAudience: 'specific-class',
          specificClass: studentClass 
        }
      ],
      endDate: { $gte: new Date() } // Only future events
    }).sort({ startDate: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventsByMonth = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const events = await CalendarEvent.find({
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    }).sort({ startDate: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add update and delete methods similarly

// In your calendarEvent controller file
exports.updateEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Optionally: Verify the user is the creator or has admin rights
      const event = await CalendarEvent.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Check permission (example: only creator/admin can update)
      if (event.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Not authorized to update this event" });
      }
  
      const updatedEvent = await CalendarEvent.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true } // Return the updated document
      );
  
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};
  


exports.deleteEvent = async (req, res) => {
    try {
      const { id } = req.params;
  console.log(id)
      // Verify the event exists
      const event = await CalendarEvent.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
    //   // Check permission (only creator/admin can delete)
    //   if (event.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
    //     return res.status(403).json({ message: "Not authorized to delete this event" });
    //   }
  
      await CalendarEvent.findByIdAndDelete(id);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  

// Add this to your controller (calendarEvent.js)
exports.getAllEvents = async (req, res) => {
    try {
      const events = await CalendarEvent.find().sort({ startDate: 1 });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// module.exports = {
//     createEvent,
//     getAllEvents, // This was missing
//     getStudentEvents,
//     getEventsByMonth,
//     updateEvent,
//     deleteEvent
//   };