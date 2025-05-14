const sessionService = require('../services/SessionServices');

exports.createSession = async (req, res) => {
    try {
        const session = await sessionService.createSession(req.body);
        res.status(201).json({ message: 'Session created successfully', session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSessions = async (req, res) => {
    try {
        const sessions = await sessionService.getSessions();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
