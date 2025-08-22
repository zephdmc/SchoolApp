const Term = require('../models/Term');

// Create a new term
exports.createTerm = async (data) => {
    const newTerm = new Term(data);
    return await newTerm.save();
};

// Get all terms
exports.getTerms = async () => {
    return await Term.find();
};

// Get a single term by ID
exports.getTermById = async (id) => {
    return await Term.findById(id);
};

// Update a term
exports.updateTerm = async (id, updateData) => {
    return await Term.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );
};

// Delete a term
exports.deleteTerm = async (id) => {
    return await Term.findByIdAndDelete(id);
};

// Additional useful methods
// -------------------------
// Get terms by session
exports.getTermsBySession = async (sessionId) => {
    return await Term.find({ session: sessionId });
};

// Check if term name exists (for validation)
exports.termNameExists = async (name, excludeId = null) => {
    const query = { name };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    return await Term.exists(query);
};