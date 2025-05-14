const classService = require('../services/ClassServices');

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


// Update an existing class
exports.updateClass = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
      const updatedClass = await classService.updateClass(id, updatedData);
      if (!updatedClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.status(200).json({ message: 'Class updated successfully', updatedClass });
    } catch (error) {
      res.status(500).json({ error: error.message });
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