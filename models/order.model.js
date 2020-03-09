const mongoose = require('mongoose');
const lead = require('./lead.model').schema;
const pickup = require('./pickup.model').schema;
const consignee = require('./consignee.model').schema;
const orderStatus = require('./orderStatus.model').schema;
const counterpart = require('./counterpart.model').schema;
const shipper = require('./shipper.model').schema;
const Order =  new mongoose.Schema({
  
    id: String,
    createdBy : String,
    createdDate: String, 
    updatedBy: String,
    updatedDate : String,
    lead: [lead],
    consignee : [consignee], 
    shipper : [shipper],
    pickup : [pickup],
    orderStatus : [orderStatus],
    counterpart : [counterpart],
    airwaybillNumber :String,
    status :String,
    timestamp:Number,
 
});
module.exports = mongoose.model('order', Order);