const termService = require('../services/TermServices');

exports.createTerm = async (req, res) => {
    try {
        const newTerm = await termService.createTerm(req.body);
        res.status(201).json({ message: 'erm created successfully', newTerm });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTerms = async (req, res) => {
    try {
        const terms = await termService.getTerms();
        res.status(200).json(terms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update an existing Term
exports.updateTerm = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
      const updatedTerm = await TermService.updateTerm (id, updatedData);
      if (!updatedClass) {
        return res.status(404).json({ message: 'Term not found' });
      }
      res.status(200).json({ message: 'Term updated successfully', updatedTerm });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete a class
  exports.deleteTerm = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedTerm = await termService.deleteTerm(id);
      if (!deletedTerm) {
        return res.status(404).json({ message: 'Term not found' });
      }
      res.status(200).json({ message: 'Term deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };