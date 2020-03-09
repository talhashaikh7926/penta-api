const mongoose = require('mongoose');


const rateSchema = new mongoose.Schema({

    id : String,  
    currency: String,
    type :String,
    zone: String,
    country: String,
    pcDoc: String,
    weight: Number,
    rates: String,
    createdDate: Date,
    createdBy: String,


    
});

module.exports = mongoose.model('Rate', rateSchema);