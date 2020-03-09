const mongoose = require('mongoose');

const UserRole =  new mongoose.Schema({              
    roleId : String,        
    discriminator: String,
    name:String

});

module.exports = mongoose.model('userRole', UserRole);