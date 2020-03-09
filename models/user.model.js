const mongoose = require('mongoose');
const UserRole = require('./userRole.model').schema;

const userSchema = new mongoose.Schema({

    id : String,  
    firstName : String,
    lastName :String,
    createdBy: String,
	createdDate: Date,
	email:{ type: String, unique: true},
    fullName: { type: String },
    password : String,
    city: String,
    country: String,
    zone :String,
   // userName : String,
    updatedBy: String,
    updatedDate: Date,
    lastLogin : {default : null, type : Date},
    securityStamp:String,
    jobTitle:{type:String },
    phoneNumber: { type : String },
    isEnabled: Boolean,
    userRoles: [ UserRole ],
   


});

module.exports = mongoose.model('User', userSchema);