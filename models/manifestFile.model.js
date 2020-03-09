const mongoose = require('mongoose');


const manifestFileSchema = new mongoose.Schema({

     id : String,
     type :String,
     city :String,
     from :String,
     to : String,
     flight :String,
     mawb :String,
     departureDate :String,
     arrivalDate:String,
     weight :String,
     pieces : String,
     createdBy: String,
     createdDate: String,
     updatedBy :String,
     updatedDate: String,

    
});

module.exports = mongoose.model('ManifestFile', manifestFileSchema);