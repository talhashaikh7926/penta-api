const mongoose = require('mongoose');

const counterpartSchema = new mongoose.Schema({

    id : String, 
    userId : String, 
    firstName : String,
    lastName :String,
	email:String,
    jobTitle:{type:String },
    phoneNumber: { type : String },
    isEnabled: Boolean,
    assignDate : Date,

   


});

module.exports = mongoose.model('Counterpart', counterpartSchema);