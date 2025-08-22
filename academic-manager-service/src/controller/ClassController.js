const classService = require('../services/ClassServices');
const Class = require('../models/Class')

exports.createClass = async (req, res) => {
    try {
        const newClass = await classService.createClass(req.body);
        res.status(201).json({ message: 'Class created successfully', newClass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getClasses = async (req, res) => {
    try {
        const classes = await classService.getClasses();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Debug: Check what's being imported


exports.updateClass = async (req, res) => {
  try {  
    const updatedClass = await classService.updateClass(
      req.params.id,
      req.body
    );
    
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.status(200).json(updatedClass);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
  // Delete a class
  exports.deleteClass = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedClass = await classService.deleteClass(id);
      if (!deletedClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  

exports.getClassById = async (req, res) => {
  try {
    const {ClassID} = req.params.id;
    const student = await Class.findOne(ClassID);
    if (!student) return res.status(407).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
