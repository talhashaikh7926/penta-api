const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({

    id : String, 
    name : String, 
    code : String,
    zone :String,
	
});

module.exports = mongoose.model('Country', countrySchema);