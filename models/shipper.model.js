const mongoose = require('mongoose');
const ShipperSchema =  new mongoose.Schema({


    id: String,
    shipperID :String,
    company: String,
    fullName:String,
    email:String,
    phone: String,
    address: String,
    city : String,
    country :String,
    createdDate: Date,
    createdBy: String,
    updatedBy: String,
    updatedDate: Date,


});
module.exports = mongoose.model('shipper', ShipperSchema);