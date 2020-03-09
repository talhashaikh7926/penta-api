const mongoose = require('mongoose');


const countryzoneSchema = new mongoose.Schema({

    id : String,  
    country: String,
    zone: String,
    parcel: String,
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate : Date,
  

    
});

module.exports = mongoose.model('Countryzone', countryzoneSchema);