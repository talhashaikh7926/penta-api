const mongoose = require('mongoose');
const RoleClaim = require('./roleClaim.model').schema;
const  SystemPermissions=  new mongoose.Schema({
    id :String,
    groupBy : String,    
    permissions : [RoleClaim],
});
module.exports = mongoose.model('system-permissions', SystemPermissions);