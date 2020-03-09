const mongoose = require('mongoose');


const salepersonSchema = new mongoose.Schema({


    id : String, 
    userId : String, 
    firstName : String,
    lastName :String,
	email:String,
    jobTitle:{type:String },
    phoneNumber: { type : String }, 
    city: String, 
    zone: String,
    country: String,
    

    
});

module.exports = mongoose.model('Saleperson', salepersonSchema);