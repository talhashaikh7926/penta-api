const mongoose = require('mongoose');
const Lead =  new mongoose.Schema({


    id: String,
    contentDescription: String,
    quotation:String,
    contentWeight: String,
    dimensions:String,
    origin: String,
    destination: String,
    clearanceCharges : String,
    clearanceInstructions :String,


});
module.exports = mongoose.model('lead', Lead);