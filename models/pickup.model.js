const mongoose = require('mongoose');
const Pickup =  new mongoose.Schema({

    
    id: String,
    createdDate :String,
    createdBy : String,
    updatedDate :String,
    updatedBy : String,

});
module.exports = mongoose.model('pickup', Pickup);