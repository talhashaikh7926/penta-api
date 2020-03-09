var Consignee = require('../models/consignee.model');
var Order = require('../models/order.model');
var Lead = require('../models/lead.model');
const Mailer = require('../service/mailer');
var Consignee = require('../models/consignee.model');
var ContactPerson = require('../models/contactperson.model');
var Pickup = require('../models/pickup.model');
var Shipper = require('../models/shipper.model');
var OrderStatus = require('../models/orderStatus.model');
var CounterPart =  require('../models/counterpart.model');
const customError = require('../models/customError.model');
const { check,validationResult } = require('express-validator');//An express.js middleware for validator
const consigneeController  =  require('./consignee.controller');
let agenda = require('../jobs/agenda');
const SendMail = require('../models/send-mail.model');
var ObjectId = require('mongodb').ObjectID;

exports.addOrder = [
    check('contentDescription', 'name is required').not().isEmpty(), async(req,res,next) => {

        let createdDate = new Date().getTime();
        
        var order = new Order();
        var lead = new Lead();
        var consignee  = new Consignee();
        var addcontact = new ContactPerson();
        var orderStatus = new OrderStatus();

        console.log(req.body);

        lead.contentDescription = req.body.lead[0].contentDescription;
        lead.quotation = req.body.lead[0].quotation;
        lead.contentWeight = req.body.lead[0].contentWeight;
        lead.dimensions = req.body.lead[0].dimensions;
        lead.origin = req.body.lead[0].origin;
        lead.destination = req.body.lead[0].destination;
        lead.clearanceCharges = req.body.lead[0].clearanceCharges;
        lead.clearanceInstructions = req.body.lead[0].clearanceInstructions;

      /*  addcontact.firstname = req.body.consignee[0].addContact.firstname;
        addcontact.lastname = req.body.consignee[0].addContact.lastname;
        addcontact.createdDate = req.body.consignee[0].addContact.createdDate;
        addcontact.emailaddress = req.body.consignee[0].addContact.emailaddress;
        addcontact.phoneNumber = req.body.consignee[0].addContact.phoneNumber;
        addcontact.address = req.body.consignee[0].addContact.address;
        addcontact.city  = req.body.consignee[0].addContact.city;
        addcontact.country = req.body.consignee[0].addContact.country;
       
        consignee.addContact.push(addcontact);*/
        consignee.companyID =  req.body.consignee[0].companyID;
        consignee.companyName = req.body.consignee[0].companyName;
        consignee.companyAddress = req.body.consignee[0].companyAddress;
        consignee.companyEmail = req.body.consignee[0].companyEmail;
        consignee.companyPhone = req.body.consignee[0].companyPhone;
        consignee.addContact = req.body.consignee[0].addContact;
        consignee.saleperson = req.body.consignee[0].saleperson;

        orderStatus.state = 'Pending';
        orderStatus.status = 'Pending Inquiry';
        orderStatus.createdDate =req.body.createdDate;
        orderStatus.createdBy =req.user.firstName+" "+req.user.lastName;
      
        order.lead.push(lead);
        order.consignee.push(consignee);
        order.orderStatus.push(orderStatus);
        order.status = '1';

        order.createdBy = req.user.firstName+" "+req.user.lastName;
        order.createdDate = req.body.createdDate;
        order.timestamp = new Date().getTime();
        order.airwaybillNumber = null;

        console.log(new Date());

        order.save(function (err, result) {
            if(err){
                return next(new customError(err, 'Failure'));

            }
            // create consignee if not exist
            consigneeController.addNewConsignee(consignee);
            var clearanceInstructionsText = "";
            var emailText = "";
            var currencyText = "";
            if(req.body.lead[0].clearanceInstructions == 'Console')
            {
              clearanceInstructionsText = "Customs Clearance ";  
              currencyText =" PKR/kg" ;
            }
            else
            {
              clearanceInstructionsText="D.O ";   
              currencyText =" PKR" ;
            }

            if(req.body.lead[0].dimensions == null)
            {
              emailText = "Kindly note the below charges and confirm us with your reply in order to proceed this pickup";   
            }
            else
            {   
              emailText = "Kindly note the below charges as per higher volumetric weight.Please confirm us with your reply in order to proceed this pickup. ";
            }


            agenda.now('lead-email',  { quotation: req.body.lead[0].quotation, 
                                        contentDescription : req.body.lead[0].contentDescription  , 
                                        fromEmail : req.user.email,
                                        fullName: req.body.consignee[0].addContact[0].fullName, email: req.body.consignee[0].companyEmail , 
                                        contentWeight :  req.body.lead[0].contentWeight , 
                                        origin :  req.body.lead[0].origin ,
                                        destination :  req.body.lead[0].destination,
                                        clearanceCharges : req.body.lead[0].clearanceCharges,
                                        clearanceInstructions : req.body.lead[0].clearanceInstructions,
                                        clearanceInstructionsText : clearanceInstructionsText,
                                        emailText : emailText,
                                        currencyText :currencyText,
                                        type: "Order" });

            agenda.now('lead-email',  { quotation: req.body.lead[0].quotation, 
                                        contentDescription : req.body.lead[0].contentDescription  , 
                                        fromEmail : req.user.email,
                                        fullName: req.body.consignee[0].addContact[0].fullName, email: req.body.consignee[0].addContact[0].email,
                                        contentWeight :  req.body.lead[0].contentWeight , 
                                        origin :  req.body.lead[0].origin ,
                                        destination :  req.body.lead[0].destination,
                                        clearanceCharges : req.body.lead[0].clearanceCharges,
                                        clearanceInstructions : req.body.lead[0].clearanceInstructions, 
                                        clearanceInstructionsText : clearanceInstructionsText,
                                        emailText : emailText,
                                        currencyText :currencyText,
                                        type: "Order" });

            
            agenda.now('lead-email',  { quotation: req.body.lead[0].quotation, 
                                        contentDescription : req.body.lead[0].contentDescription  , 
                                        fromEmail : req.user.email,
                                        fullName: req.body.consignee[0].addContact[0].fullName, email: 'hira.shaikh@een.group',
                                        contentWeight :  req.body.lead[0].contentWeight , 
                                        origin :  req.body.lead[0].origin ,
                                        destination :  req.body.lead[0].destination,
                                        clearanceCharges : req.body.lead[0].clearanceCharges,
                                        clearanceInstructions : req.body.lead[0].clearanceInstructions, 
                                        clearanceInstructionsText : clearanceInstructionsText,
                                        currencyText :currencyText,
                                        emailText : emailText,
                                        type: "Order" });


            return res.status(201).json({});
        });


        
        



    }
];


exports.updateOrder = [

  check('contentDescription', 'name is required').not().isEmpty(),
  
   async (req, res, next) => {
  if(!req.params.id) {
    return next(new CustomError(errors,'InvlidRequest'));      
  }

  const errors = validationResult(req);
  /*if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    return next(new ValidationErrors(errors));
  }*/
  
  let updatedDate = new Date().toString();
    await Order.findOne({ _id: req.params.id }, async (err, order) => {
    if (err) {
      return next(new CustomError(err, 'UnknownError'));

    }

        order.lead[0].contentDescription = req.body.lead[0].contentDescription;
        order.lead[0].quotation = req.body.lead[0].quotation;
        order.lead[0].contentWeight = req.body.lead[0].contentWeight;
        order.lead[0].dimensions = req.body.lead[0].dimensions;
        order.lead[0].origin = req.body.lead[0].origin;
        order.lead[0].destination = req.body.lead[0].destination;
        order.lead[0].clearanceCharges = req.body.lead[0].clearanceCharges;
        order.lead[0].clearanceInstructions = req.body.lead[0].clearanceInstructions;

        order.consignee[0].companyID =  req.body.consignee[0].companyID;
        order.consignee[0].companyName = req.body.consignee[0].companyName;
        order.consignee[0].companyAddress = req.body.consignee[0].companyAddress;
        order.consignee[0].companyEmail = req.body.consignee[0].companyEmail;
        order.consignee[0].companyPhone = req.body.consignee[0].companyPhone;
        order.consignee[0].addContact[0] = req.body.consignee[0].addContact;
        order.consignee[0].saleperson[0] = req.body.consignee[0].saleperson;
      
        order.updatedBy = req.user.firstName+" "+req.user.lastName;
        order.updatedDate = updatedDate;
        order.airwaybillNumber = null;

        console.log(req.body.consignee[0]);

       order.save((error) => {
       if (error) { 
        return next(new CustomError(error, 'UnknownError'));
        }

     
      return res.status(201).json({});
    });
  
    });
  }  
];


exports.getAllOrder = async(req,res,next) => {
    var pageNo = parseInt(req.query.page);
    var size = parseInt(req.query.limit);
    var sortColumn = (req.query.sort === undefined ? "createdDate" : req.query.sort);
    var order = (req.query.order === undefined ? "desc" : req.query.order);
    var q = (req.query.q != undefined && req.query.q.length > 0 ? req.query.q : null);

    console.log(req.query);
    var countFilter = {}, queryFilter = {};
    if(q != null && !isEmpty(q) && q != "undefined")
    {
      //await Role.ensureIndexes();
      //queryFilter["$text"] = {"$search" : q};

    

      queryFilter["status"] = { "$regex": q };

     
  
    }
    var query = {};
    if(pageNo < 0 || pageNo === 0) 
    {  
      return next(new CustomError(  "invalid page number, should start with 1", "PaginationError", 400));
    }
    query.skip  = size * (pageNo - 1);
    var sort = {};
    query.limit = size;
    sort[sortColumn] = order;
    query.sort = sort;
    Order.countDocuments(queryFilter, function(err,totalCount) {
    Order.find(queryFilter,{}, query, function(err, orders){
      if (err) 
      {
        return next(new CustomError(err));
      }
      var totalPages = Math.ceil(totalCount / size); 
      var hasMore = (totalCount > query.skip + size);
      var totalElements = Math.abs(hasMore == true? size : (totalCount - query.skip )); 
      response = {"data" : orders, "totalPages": totalPages, "totalElements":totalElements,"totalRecords" : totalCount, "hasMore" : hasMore};
      return res.json(response).status(200);
      });
    })
}

exports.deleteOrderByID= async(req, res, next) => {
    if(!req.params.id) {
      next(new CustomError(errors,'InvlidRequest'));      
    }
    Order.deleteOne({ _id: req.params.id }, (err) => 
    {
      if (err) {  return next(new CustomError(err)); }
      else
      {
        console.log("Order has been deleted");
        res.status(204).json({});
      }
    });      
} 

exports.getOrderByOrderID = async(req,res,next) => 
{
  if(!req.params.id) {
    return next(new CustomError(err));
  }
  await Order.findOne({ _id : req.params.id}, async (err,order) =>{
    if (err) 
        {
          return next(new CustomError(err));
        }  
    response = order;
    return res.json(response).status(200);
    })
 
}

// exports.reminderMail = async(req,res,next) => 
// {
//   if(!req.params.id) {
//     return next(new CustomError(err));
//   }
//   var Email = "";
//   var sub = '';
//   var msg = '';
//   await Order.findOne({ _id: req.params.id }, async (err, order) => {
//           if (err) 
//           {
//            return next(new CustomError(err));
//             }  
//            Email = order.consignee[0].companyemail   
//            console.log(Email);
          
//           var sendmail = new SendMail();
//            sub = sendmail.subject = req.body.subject;
//            msg = sendmail.message = req.body.message;
//            response = order
//           console.log(sub);
    
//         agenda.now('send-mail', { Subject:  sub, Message: msg, email: Email , type: "reminderMail" });
//          return res.json(response).status(200);
//     })
 
// }


// initiate pickup
exports.addPickup = [

  check('shipperFullName', 'shipper Name is required').not().isEmpty(),
  check('shipperEmail', 'shipper Email is required').not().isEmpty(),
  
   async (req, res, next) => {
  if(!req.params.id) {
    return next(new CustomError(errors,'InvlidRequest'));      
  }

  const errors = validationResult(req);
  /*if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    return next(new ValidationErrors(errors));
  }*/
  
  let date = new Date().toString();

  await Order.findOne({ _id: req.params.id }, async (err, order) => {
    if (err) {
      return next(new CustomError(err, 'UnknownError'));
    }
    //add pickup
    if(order.pickup.length == 0)
    {

      console.log(req.body);

      generateAirwaybillNumber().then(function (awb) {

        var pickup = new Pickup();
        var orderStatus = new OrderStatus();
        var shipper = new Shipper();
        shipper.shipperID = req.body.shipperID;
        shipper.company = req.body.shipperCompany;
        shipper.fullName = req.body.shipperFullName;
        shipper.phone = req.body.shipperPhone;
        shipper.email = req.body.shipperEmail;
        shipper.address = req.body.shipperAddress;
        shipper.city = req.body.shipperCity;
        shipper.country = req.body.shipperCountry;
        pickup.createdDate =date;
        pickup.createdBy = req.user.firstName+" "+req.user.lastName;

        orderStatus.state = 'In Process';
        orderStatus.status = 'Pickup Initated';
        orderStatus.createdDate =date;
        orderStatus.createdBy =req.user.firstName+" "+req.user.lastName;
        
        order.shipper.push(shipper);
        order.pickup.push(pickup);
        order.orderStatus.push(orderStatus);

        order.airwaybillNumber = awb;
        order.status = '2';
    
        order.save((error) => {
          if (error) { 
            return next(new CustomError(error, 'UnknownError'));
            }
    
          return res.status(201).json({});
        });
           
      });

    }
    // edit pickup
    else
    {
      order.shipper[0].shipperID = req.body.shipperID;
      order.shipper[0].company = req.body.shipperCompany;
      order.shipper[0].fullName = req.body.shipperFullName;
      order.shipper[0].phone = req.body.shipperPhone;
      order.shipper[0].email = req.body.shipperEmail;
      order.shipper[0].address = req.body.shipperAddress;
      order.shipper[0].city = req.body.shipperCity;
      order.shipper[0].country = req.body.shipperCountry;
      order.pickup[0].updatedDate =date;
      order.pickup[0].updatedBy = req.user.firstName+" "+req.user.lastName;
       
        order.save((error) => {
          if (error) { 
            return next(new CustomError(error, 'UnknownError'));
            }
    
          return res.status(201).json({});
        });

    }

  });
  }  
];

// order Status
exports.orderStatus = [
  check('state', 'state is required').not().isEmpty(), async(req,res,next) => {

    if(!req.params.id) {
      return next(new CustomError(errors,'InvlidRequest'));      
    }
  
    const errors = validationResult(req);
    /*if (!errors.isEmpty()) {
      //return res.status(422).json({ errors: errors.array() });
      return next(new ValidationErrors(errors));
    }*/
    
    await Order.findOne({ _id: req.params.id }, async (err, order) => {
      if (err) {
        return next(new CustomError(err, 'UnknownError'));
      }

      let createdDate = new Date().toString();
      var orderStatus = new OrderStatus();

      orderStatus.state = req.body.state;
      orderStatus.status = req.body.status;
      orderStatus.createdDate =createdDate;
      orderStatus.createdBy ="Admin";


      order.orderStatus.push(orderStatus);

      order.save(function (err, result) {
          if(err){
              return next(new customError(err, 'Failure'));

          }
          return res.status(201).json({});
      });      
  

  });
}
];


// order Assign CounterPart
exports.assignCounterpart = async(req,res,next) => {

    if(!req.params.id) {
      return next(new CustomError(errors,'InvlidRequest'));      
    }

    const errors = validationResult(req);
  
    await Order.findOne({ _id: req.params.id }, async (err, order) => {
      if (err) {
        return next(new CustomError(err, 'UnknownError'));
      }

      let assignDate = new Date().toString();
      var counterPart = new CounterPart();
     
      if( isEmpty(order.counterpart))
      {
        var counterPart = new CounterPart();
        counterPart.firstName = req.body.firstName;
        counterPart.lastName = req.body.lastName;
        counterPart.email =req.body.email;
        counterPart.jobTitle =req.body.jobTitle;
        counterPart.isEnabled =req.body.isEnabled;
        counterPart.phoneNumber =req.body.phoneNumber;
        counterPart.userName = req.body.userName;
        counterPart.assignDate = assignDate;
        counterPart.userId = req.body._id;

        order.counterpart.push(counterPart);

        order.save(function (err, result) {
            if(err){
                return next(new customError(err, 'Failure'));

            }
            return res.status(201).json({});
        });  

      }

      else
      {

        order.counterpart[0].firstName = req.body.firstName;
        order.counterpart[0].lastName = req.body.lastName;
        order.counterpart[0].email =req.body.email;
        order.counterpart[0].jobTitle =req.body.jobTitle;
        order.counterpart[0].isEnabled =req.body.isEnabled;
        order.counterpart[0].phoneNumber =req.body.phoneNumber;
        order.counterpart[0].userName = req.body.userName;
        order.counterpart[0].assignDate = assignDate;
        order.counterpart[0].userId = req.body._id;

      //  order.counterpart.push(counterPart);

        order.save(function (err, result) {
            if(err){
                return next(new customError(err, 'Failure'));

            }
            return res.status(201).json({});
        }); 





      }

      

          
  

  });
}


function isEmpty(obj) 
{
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
}

//exports.generateAirwaybillNumber = async() => 
async function generateAirwaybillNumber()
{
  let awbnum ="";
  await Order.findOne({}).sort({"airwaybillNumber":-1}).limit(1).then((data) => {
    
    if(data.airwaybillNumber == null)
    {
     awbnum="Penta-0001";

    }
    else
    {
    
    var airwaybill = data.airwaybillNumber;
    var awb = airwaybill.split("-");
    var num ;
    if(awb[1] < '0009')
    {
      var n =  parseInt(awb[1])+1;
      num ="000"+n
    }
    else if(awb[1] < '009')
    {
      var n =  parseInt(awb[1])+1;
      num ="00"+n
    }
    else if(awb[1] < '099')
    {
      var n =  parseInt(awb[1])+1;
      num ="0"+n
    }
    else{

     num = parseInt(awb[1])+1;

    }

     awbnum = "Penta-"+num;

    }

  })

 return awbnum;

}


// arrange pickup for key customer or consignee
exports.arrangePickup = [
 // check('shipperName', 'shipper Name is required').not().isEmpty(),
 // check('shipperEmail', 'shipper Email is required').not().isEmpty(), 
  async(req,res,next) => {

      let createdDate = new Date().toString();

    generateAirwaybillNumber().then(function (awb) {

      var order = new Order();
      var lead = new Lead();
      var consignee  = new Consignee();
      var addcontact = new ContactPerson();
      var orderStatus = new OrderStatus();
      var pickup = new Pickup();
      var shipper = new Shipper();

      console.log(req.body);

      lead.contentDescription = 'unknown';
      lead.quotation = '';
      lead.contentWeight = '';
      lead.dimensions = '';
      lead.origin = '';
      lead.destination = '';
      lead.clearanceCharges = '';
      lead.clearanceInstructions = '';

      consignee.companyID =  req.body.consignee[0].companyID;
      consignee.companyName = req.body.consignee[0].companyName;
      consignee.companyAddress = req.body.consignee[0].companyAddress;
      consignee.companyEmail = req.body.consignee[0].companyEmail;
      consignee.companyPhone = req.body.consignee[0].companyPhone;
      consignee.addContact = req.body.consignee[0].addContact;

      shipper.shipperID =req.body.pickup[0].shipperID;
      shipper.company = req.body.pickup[0].shipperCompany;
      shipper.fullName = req.body.pickup[0].shipperFullName;
      shipper.phone = req.body.pickup[0].shipperPhone;
      shipper.email = req.body.pickup[0].shipperEmail;
      shipper.address = req.body.pickup[0].shipperAddress;
      shipper.city = req.body.pickup[0].shipperCity;
      shipper.country = req.body.pickup[0].shipperCountry;
   
      pickup.createdDate =createdDate;
      pickup.createdBy = req.user.firstName+" "+req.user.lastName;

      orderStatus.state = 'In Process';
      orderStatus.status = 'Pickup Initated';
      orderStatus.createdDate =createdDate;
      orderStatus.createdBy =req.user.firstName+" "+req.user.lastName;
     
      order.shipper.push(shipper);
      order.lead.push(lead);
      order.consignee.push(consignee);
      order.orderStatus.push(orderStatus); 
      order.pickup.push(pickup);
      order.status = '2';

      order.createdBy = req.user.firstName+" "+req.user.lastName;
      order.createdDate = createdDate;
      order.airwaybillNumber = awb;

      order.save(function (err, result) {
          if(err){
              return next(new customError(err, 'Failure'));

          }
          // create consignee if not exist
          consigneeController.addNewConsignee(consignee);
         // return res.status(201).json({});

          return res.json(result).status(201);
          
      });


      
      

    });

  }
];




