const mongoose = require('mongoose');


const discountSchema = new mongoose.Schema({

    id: String,
    percentage :String,
    zones : String,
    countries: String,
    weight: String,
    parcelDocument :String,
    type :String,
    currency :String,
    matureDate :String,
    createdDate: Date,
    createdBy: String,
    updatedBy: String,
    updatedDate: Date,

});

module.exports = mongoose.model('Discount', discountSchema);