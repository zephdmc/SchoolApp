const Term = require('../models/Term');

exports.createTerm = async (data) => {
    const newTerm = new Term(data);
    return await newTerm.save();
};

exports.getTerms = async () => {
    return await Term.find();
};
