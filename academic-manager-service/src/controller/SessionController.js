const sessionService = require('../services/SessionServices');

// Create session
exports.createSession = async (req, res) => {
    try {
        // Validate dates
        if (new Date(req.body.endDate) <= new Date(req.body.startDate)) {
            return res.status(400).json({ error: 'End date must be after start date' });
        }

        const session = await sessionService.createSession(req.body);
        res.status(201).json({ message: 'Session created successfully', session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all sessions
exports.getSessions = async (req, res) => {
    try {
        const sessions = await sessionService.getSessions();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update session
exports.updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate dates if provided
        if (req.body.startDate && req.body.endDate) {
            if (new Date(req.body.endDate) <= new Date(req.body.startDate)) {
                return res.status(400).json({ error: 'End date must be after start date' });
            }
        }

        const updatedSession = await sessionService.updateSession(id, req.body);
        if (!updatedSession) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json({ message: 'Session updated successfully', session: updatedSession });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete session
exports.deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSession = await sessionService.deleteSession(id);
        if (!deletedSession) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single session (optional)
exports.getSession = async (req, res) => {
    try {
        const session = await sessionService.getSessionById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};