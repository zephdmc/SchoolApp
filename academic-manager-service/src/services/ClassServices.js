const Class = require('../models/Class');

exports.createClass = async (data) => {
    const newClass = new Class(data);
    return await newClass.save();
};

exports.getClasses = async () => {
    return await Class.find();
};
