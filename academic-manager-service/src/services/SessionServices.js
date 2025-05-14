const Session = require('../models/Session');

exports.createSession = async (data) => {
    const session = new Session(data);
    return await session.save();
};

exports.getSessions = async () => {
    return await Session.find();
};
