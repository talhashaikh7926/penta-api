var Consignee  = require ('../models/consignee.model');
var ContactPerson = require('../models/contactperson.model');
const CustomError = require('../models/customError.model');
const Shipper = require('../models/shipper.model');
const { check,validationResult } = require('express-validator');
var ObjectId = require('mongodb').ObjectID;



exports.addFiles =    async (req, res, next) => {
    
    var type = req.body.type;
    var data =  req.body.data;
    let createdDate = new Date().toString();
    data.shift();
    data = data.filter(Boolean);
 
         var i = 0;
         data.forEach(function(item){

         var shipper = new Shipper();
         var consignee = new Consignee();
         var cells =  csvToArray(data[i]);
 
         if(data[i] != "") {}
  
              if(type == "Shipper")
              {


                shipper.company = cells[1];
                shipper.fullname = cells[2];
                shipper.email = cells[4];
                shipper.phone = cells[5];
                shipper.address = cells[6];
                shipper.city = cells[7];
                shipper.country = cells[8];

                shipper.save(function (error, result) {
                  if (error) {
                      return next(new CustomError(error, 'Failure'));
                  }  
  
          
                  });  

              }
              else if(type == "Consignee")
              {
                var consignee  = new Consignee();
                var addcontact = new ContactPerson();
 
                addcontact.firstname = cells[1];
                addcontact.lastname = cells[2];
                addcontact.createdDate = cells[3];
                addcontact.emailaddress = cells[4];
                addcontact.phoneNumber = cells[5];
                addcontact.address = cells[6];
                addcontact.city  = cells[7];
                addcontact.country = cells[8];
                
                consignee.addContact.push(addcontact);
                    
                consignee.companyname = cells[1];
                consignee.companyaddress = cells[2];
                consignee.companyemail = cells[3];
                consignee.companyphone = cells[4];
                consignee.createdDate = cells[5];

                consignee.save(function (error, result) {
                  if (error) {
                      return next(new CustomError(error, 'Failure'));
                  }  
  
          
                  });  
 
              }
                    
          i++;
        });

        if(data.length  == i)
        {
         return res.status(201).json({});;
        }
 

}

