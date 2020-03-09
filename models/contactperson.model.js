const mongoose = require('mongoose');

const contactpersonSchema = new mongoose.Schema({

     id: String,
     fullName: String,
     designation :String,
     emailAddress: String,
     phoneNumber: String,
     mobile: String,
    /*public address: String,
    public city: String,
    public country: String,
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date,*/

})

module.exports = mongoose.model('ContactPerson', contactpersonSchema);