const mongoose = require('mongoose');
const percentageSchema = new mongoose.Schema({

    id: String,
    currency: String,
    o_type: String,
    type: String,
    percentages: String,
    range: String,
    createdDate: Date,
    
})

module.exports = mongoose.model('Percentage', percentageSchema);