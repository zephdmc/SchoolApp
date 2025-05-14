const examComputation = require('../models/examComputation');

exports.createComputation = async (data) => {
    const computation = new examComputation(data);
    return await computation.save();
};

exports.getComputations = async () => {
    return await examComputation.find();
};

exports.deleteComputation = async (id) => {
    try {
        const deletedComputation = await examComputation.findByIdAndDelete(id);
        return deletedComputation; // Returns null if Computation not found
    } catch (error) {
        throw new Error("Error deleting Computation: " + error.message);
    }
};