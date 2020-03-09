const mongoose = require('mongoose');
const ContactPerson = require('./contactperson.model').schema;
const salePerson = require('./saleperson.model').schema;

const unitSchema = new mongoose.Schema({

   id: String,
   address :String,
   city : String,
   country: String,
   phoneNum: String,
   zone : String,
   salepersonId : String,
   salePerson : [salePerson],
   contactPerson : [ContactPerson],
   createdBy: String,
   createdDate: Date,
   updatedBy: String,
   updatedDate: Date,

})

module.exports = mongoose.model('Unit', unitSchema);






