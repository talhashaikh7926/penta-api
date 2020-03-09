const mongoose = require('mongoose');
const RoleClaim = require('./roleClaim.model').schema;
const Role =  new mongoose.Schema({
    id :String,
    concurrencyStamp : String,    
    createdBy : String,
    createdDate: String,    
    description: String,    
    name : String,
    normalizedName: String,
    updatedBy: String,
    updatedDate : String,
    roleClaims: [RoleClaim]   
});
module.exports = mongoose.model('role', Role);