const mongoose = require('mongoose');

const estimatedBusinessSchema = new mongoose.Schema({

    id: String,
    docType :String,
    rev :String,
    shipment:String,
    weight :String,
   
});

module.exports = mongoose.model('EstimatedBusiness', estimatedBusinessSchema);