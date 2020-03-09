const mongoose = require('mongoose');
const RoleClaim =  new mongoose.Schema({            
    claimType: String,
    claimValue: {type: String,  text : true},
    discriminator:{type: String,  text : true},
    checked:Boolean,
    roleId : String       
});

module.exports =mongoose.model('roleClaim',  RoleClaim);
