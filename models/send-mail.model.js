const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({

    subject: String,
    message: String,
   


});

module.exports = mongoose.model('OrderSendmail', mailSchema);