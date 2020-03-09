const mongoose = require('mongoose');
const unit = require('./unit.model').schema;
const discount = require('./discount.model').schema;
const fsc = require('./fsc.model').schema;
var estimatedBusiness = require('./estimatedBusiness.model').schema;

const consigneeSchema = new mongoose.Schema({

        id: String,
        isCorporate :String,
        type : String,
        companyID: String,
        companyPassword :String,
        companyName: String,
        status :String,
        paymentTerm :String,
        creditLimit :String,

        natureOfBusiness : String,
        postalCode :String,
        ntn :String,
        gst :String,
   
        decisionMakerName: String,
        decisionMakerDesignation: String,
        decisionMakerPhone: String,
        decisionMakerCell: String,
        decisionMakerEmail: String,
   
        accountName: String,
        accountDesignation: String,
        accountPhone: String,
        accountCell: String,
        accountEmail: String,
        isUnit :String,
        unit: [unit],
        discount : [discount],
        fsc : [fsc],
        estimatedBusiness :[estimatedBusiness],
        createdDate: Date,
        createdBy: String,
        updatedBy: String,
        updatedDate: Date,
        timeStamp :Number,
})

module.exports = mongoose.model('Consignee', consigneeSchema);