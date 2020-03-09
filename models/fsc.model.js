const mongoose = require('mongoose');


const fscSchema = new mongoose.Schema({

    id: String,
    fscPercentage :String,
    fscZone : String,
    fscCountry: String,
    fscParcelDocument :String,
   
    
});

module.exports = mongoose.model('Fsc', fscSchema);