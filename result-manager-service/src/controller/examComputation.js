const computationService = require('../services/examComputationService');

exports.createComputation = async (req, res) => {
    try {
        console.log("e reach here");

        console.log(req.body);
        const computation = await computationService.createComputation(req.body);
        res.status(201).json({ message: 'Exam Computation created successfully', computation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getComputations = async (req, res) => {
    try {
        const computations = await computationService.getComputations();
        res.status(200).json(computations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
