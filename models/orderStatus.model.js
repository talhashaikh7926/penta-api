const mongoose = require('mongoose');

const OrderStatus =  new mongoose.Schema({

    id: String,
    state: String,
    status:String,
    createdDate: String,
    createdBy :String,

});
module.exports = mongoose.model('orderStatus', OrderStatus);