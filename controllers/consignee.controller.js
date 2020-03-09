var Consignee  = require ('../models/consignee.model');
var Unit =  require('../models/unit.model');

var ContactPerson = require('../models/contactperson.model');
var Saleperson = require('./../models/saleperson.model');
const CustomError = require('../models/customError.model');
var UserRole = require('./../models/userRole.model');
var Discount = require('./../models/discount.model');
var Fsc = require('./../models/fsc.model');
var EstimatedBusiness = require('./../models/estimatedBusiness.model');

var User = require('./../models/user.model');
var Role = require('./../models/role.model');
const { check,validationResult } = require('express-validator');
var ObjectId = require('mongodb').ObjectID;
let agenda = require('../jobs/agenda');
const Mailer = require('../service/mailer');
const helper = require('../helpers/helper');

/**
 * Post Add New Consignee
*/
exports.addConsignee=[
 
    check('companyName', 'name is required').not().isEmpty(), async(req,res,next) =>{

        Consignee.findOne({ companyName: req.body.companyName }, (err, existingCompany) => {
            if (err) { return next(err); }
            if (existingCompany) {
              return next(new CustomError('Consignee with that name already exists.', 'ConsigneeCreationFailure', 409));
            }

            var consignee  = new Consignee();
            var unit =  new Unit();
            var contactPerson = new ContactPerson();
            var saleperson = new Saleperson();  
            var discount = new Discount();
            var fsc = new Fsc();
            var estimatedBusiness =  new EstimatedBusiness();

            const randomPassword = helper.generatePassword(); //rand.generatePassword(defaultPasswordConfig);

            
            if (err) { return next(new CustomError(err)); } 
                
           generateCompanyID().then(function (companyID) {

            consignee.isCorporate =req.body.isCorporate;
            consignee.type = req.body.type;
            consignee.companyID = companyID;
            consignee.companyPassword = randomPassword;
            consignee.companyName=req.body.companyName;

            consignee.status = 1;
            consignee.paymentTerm = req.body.paymentTerm;
            consignee.creditLimit = req.body.creditLimit;
          
            consignee.natureOfBusiness = req.body.natureOfBusiness;
            consignee.postalCode = req.body.postalCode;
            consignee.ntn = req.body.ntn;
            consignee.gst = req.body.gst;

            consignee.decisionMakerName = req.body.decisionMakerName;
            consignee.decisionMakerDesignation = req.body.decisionMakerDesignation;
            consignee.decisionMakerPhone = req.body.decisionMakerPhone;
            consignee.decisionMakerCell = req.body.decisionMakerCell;
            consignee.decisionMakerEmail = req.body.decisionMakerEmail;
   
            consignee.accountName =  req.body.accountName;
            consignee.accountDesignation =  req.body.accountDesignation;
            consignee.accountPhone = req.body.accountPhone;
            consignee.accountCell = req.body.accountCell;
            consignee.accountEmail=  req.body.accountEmail;
            consignee.isUnit =req.body.isUnit;
            
            consignee.createdDate = req.body.createdDate;
            consignee.createdBy =req.user.firstName+" "+req.user.lastName;
      
            u=0;
            req.body.unit.forEach(function(unit){

                if(unit != null)
                {
                    unit.address =unit.address;
                    unit.city =unit.city;
                    unit.country=unit.country;
                    unit.phoneNum=unit.phoneNum;
                    unit.zone = unit.zone;
                    unit.contactPerson = unit.contactPerson;
                    unit.salepersonId = unit.salepersonId;

                  /*  User.findOne({ _id :unit.salepersonId}, async (err,user) =>{

                        saleperson.firstName = user.firstName;
                        saleperson.lastName = user.lastName;
                        saleperson.email =user.email;
                        saleperson.jobTitle =user.jobTitle;
                        saleperson.city =user.city;
                        saleperson.zone =user.zone;
                        saleperson.country =user.country;
                        saleperson.phoneNumber =user.phoneNumber;
                        saleperson.userId = user._id;

                        console.log(saleperson);

                       // console.log(c.unit);

                        unit.salePerson = saleperson;
 
                      //  unit.salePerson.push(saleperson);
                    
                   
                    })*/
                
                    consignee.unit.push(unit);
                }
                
            });


            req.body.discount.forEach(function(discount){
                
                if(discount != null)
                { 
                consignee.discount.push(discount)
                }
                    
            });

            req.body.estimatedBusiness.forEach(function(estimatedBusiness){
                
                if(estimatedBusiness != null)
                {
                consignee.estimatedBusiness.push(estimatedBusiness)
                }
                    
            });

            req.body.fsc.forEach(function(fsc){
                
                if(fsc != null)
                {  
                consignee.fsc.push(fsc)
                }
                    
            });
     
            consignee.save(function (err,c){
                    if(err){
                        return next(new CustomError(err, 'Failure'));
                    }
                      
                    c.unit.forEach(function(unit ,i){

                    User.findOne({ _id :unit.salepersonId}, async (err,user) =>{

                        saleperson.firstName = user.firstName;
                        saleperson.lastName = user.lastName;
                        saleperson.email =user.email;
                        saleperson.jobTitle =user.jobTitle;
                        saleperson.city =user.city;
                        saleperson.zone =user.zone;
                        saleperson.country =user.country;
                        saleperson.phoneNumber =user.phoneNumber;
                        saleperson.userId = user._id;

                        c.unit[i].salePerson.push(saleperson);

                        c.save(function (err,data){
                            if(err){
                                return next(new CustomError(err, 'Failure'));
                            }
    
                        })
                    });
                          
                });

                return res.status(201).json(c);
            })


            });

    });


    }
    
]




/**
 * Get Consignee By Name
*/

exports.getConsigneeByName = async(req, res, next) => {

      Consignee.find({ companyName: req.params.name } , (err, consignee) => {
            if (err) {
                logger.error(new CustomError('Error occured while fetching users for sending push notifications  \r\n ' + err));
            }
   response = consignee;
   return res.json(response).status(200);
  });
   
};



/**
 * Delete Consignee By ID
*/
exports.deleteConsigneeID= async(req,res,next) =>{

    if(!req.params.id) {
        next(new customError(err,'InvalidRequest'));
    }
    Consignee.deleteOne({_id: req.params.id }, (err) =>{
        if(err) { return next(new customError(err)); }
        else 
        {
            console.log('Consignee has been deleted');

        }  
       return res.status(201).json({});
       });
}

/**
 * Get all Consignee List
*/
exports.getAllConsignee = async(req,res,next) => {
    var pageNo = parseInt(req.query.page);
    var size = parseInt(req.query.limit);
    var sortColumn = (req.query.sort === undefined ? "createdDate" : req.query.sort);
    var order = (req.query.order === undefined ? "desc" : req.query.order);
    var q = (req.query.q != undefined && req.query.q.length > 0 ? req.query.q : null);
    var countFilter = {}, queryFilter = {};
    if(q != null && !isEmpty(q) && q != "undefined")
    {
      //await Role.ensureIndexes();
      //queryFilter["$text"] = {"$search" : q};
  
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
    Consignee.countDocuments(countFilter, function(err,totalCount) {
    Consignee.find(queryFilter,{}, query, function(err, consignees){
      if (err) 
      {
        return next(new CustomError(err));
      }
      var totalPages = Math.ceil(totalCount / size); 
      var hasMore = (totalCount > query.skip + size);
      var totalElements = Math.abs(hasMore == true? size : (totalCount - query.skip )); 
      response = {"data" : consignees, "totalPages": totalPages, "totalElements":totalElements,"totalRecords" : totalCount, "hasMore" : hasMore};
      return res.json(response).status(200);
      });
    })
}


/**
 * Put update Consignee By Id
*/
exports.updateConsigneeByID = [  check('companyName', 'name is required').not().isEmpty(), async(req,res,next) =>{
  
    await Consignee.findOne({"_id" : ObjectId(req.params.id)} , async (err, consignee) =>{
        if(err) {
            return next(new CustomError(err, 'UnknownError'));

        }
         
            consignee.isCorporate =req.body.isCorporate;
            consignee.type = req.body.type;
            consignee.companyName=req.body.companyName;

            consignee.status = 1;
            consignee.paymentTerm = req.body.paymentTerm;
            consignee.creditLimit = req.body.creditLimit;
          
            consignee.natureOfBusiness = req.body.natureOfBusiness;
            consignee.postalCode = req.body.postalCode;
            consignee.ntn = req.body.ntn;
            consignee.gst = req.body.gst;

            consignee.decisionMakerName = req.body.decisionMakerName;
            consignee.decisionMakerDesignation = req.body.decisionMakerDesignation;
            consignee.decisionMakerPhone = req.body.decisionMakerPhone;
            consignee.decisionMakerCell = req.body.decisionMakerCell;
            consignee.decisionMakerEmail = req.body.decisionMakerEmail;
   
            consignee.accountName =  req.body.accountName;
            consignee.accountDesignation =  req.body.accountDesignation;
            consignee.accountPhone = req.body.accountPhone;
            consignee.accountCell = req.body.accountCell;
            consignee.accountEmail=  req.body.accountEmail;
            consignee.isUnit =req.body.isUnit;
            consignee.updatedDate = req.body.updatedDate;
            consignee.updatedBy =req.user.firstName+" "+req.user.lastName;

            consignee.unit = [];

            u=0;
            req.body.unit.forEach(function(unit){
                
                if(unit != null)
                {
                  unit.address =unit.address;
                  unit.city =unit.city;
                  unit.country=unit.country;
                  unit.phoneNum=unit.phoneNum;
                  unit.zone = unit.zone;
                  unit.contactPerson = unit.contactPerson;
                  unit.salepersonId = unit.salepersonId;

                consignee.unit.push(unit);
                }
            });

            u++;

        
        consignee.discount = [];
        req.body.discount.forEach(function(discount){
                
            if(discount != null)
            { 
             consignee.discount.push(discount)
            }
                    
        });

        consignee.estimatedBusiness = [];
        req.body.estimatedBusiness.forEach(function(estimatedBusiness){
                
            if(estimatedBusiness != null)
            {
            consignee.estimatedBusiness.push(estimatedBusiness)
            }
                    
        });

        consignee.fsc = [];
        req.body.fsc.forEach(function(fsc){
                
            if(fsc != null)
            {  
            consignee.fsc.push(fsc)
            }          
        });

         
        consignee.save(function (err,c){
            if(err){
                return next(new CustomError(err, 'Failure'));
            }

                c.unit.forEach(function(unit ,i){

                User.findOne({ _id :unit.salepersonId}, async (err,user) =>{

                    saleperson.firstName = user.firstName;
                    saleperson.lastName = user.lastName;
                    saleperson.email =user.email;
                    saleperson.jobTitle =user.jobTitle;
                    saleperson.city =user.city;
                    saleperson.zone =user.zone;
                    saleperson.country =user.country;
                    saleperson.phoneNumber =user.phoneNumber;
                    saleperson.userId = user._id;

                    c.unit[i].salePerson.push(saleperson);

                    c.save(function (err,data){
                        if(err){
                            return next(new CustomError(err, 'Failure'));
                        }
    
                    })

                    });
                          
                    });
                    return res.status(201).json(c);
            })

    });
    }
];


exports.addConsigneeByID = [
    check('name', 'name is required').not().isEmpty(),
    async(req,res,next)=>{
        if(!req.params.id) {
            return next (new customError(error,'InvalidRequest'));

        }
  
   await Consignee.findOneAndUpdate({_id: req.params.id }, async (err, Consignee) =>{
        if(err) {
           return next(new customError(err, 'UnknownError'));

        }
        Consignee.addContact = req.body.addContact;
        const userRole = new UserRole({

            roleId : req.body.roles[0].roleId,
            name : req.body.roles[0].name,
            discriminator: req.body.roles[0].description
            });
           
            Consignee.userRoles.push(userRole);
  
        Consignee.push((error) =>{
            if(error) {
                return next(new customError(error,'UnknownError'));
            }
            return res.status(201).json({});
        });

    });
    }
];


// 
exports.updateStatusByConsigneeID = async(req,res,next) =>{
 
    if(!req.params.id){
        return next(new customError(err));

    }

    Consignee.findOne({_id: req.params.id}, async (err,consignee) =>{

        if(err)
        {
            return next(new customError(err));
        }

        if(consignee.status == "1")
        {
            consignee.status = "0";
        }
        else 
        {
            consignee.status = "1";    
        }

        consignee.save((error) =>{
            if(error) {
                return next(new customError(error,'UnknownError'));
            }
            return res.status(201).json({});
        });

});

}




//getPersonInfo By ID
exports.getConsigneeByConsigneeID = async(req,res,next) => {

         if(!req.params.id){
             return next(new CustomError(err));
         }
         await Consignee.findOne({_id : req.params.id}, async (err,consignee) =>{
            if(err){
                return next(new CustomError(err));
            }
         respone = consignee;
         return res.json(respone).status(200);  
         })
}



this.addNewConsignee =   function(newconsignee) {

    //this.addConsignee(req);

    Consignee.findOne({ companyname:  newconsignee.companyname }, (err, existingCompany) => {
        if (err) { return next(err); }
        if (!existingCompany) {
         // return next(new CustomError('Consignee with that name address already exists.', 'ConsigneeCreationFailure', 409));
    
        var consignee  = new Consignee();
        var addcontact = new ContactPerson();
        let createdDate = new Date().toString();

        console.log(newconsignee);

        addcontact.firstname = newconsignee.addContact[0].firstname;
        addcontact.lastname = newconsignee.addContact[0].lastname;
        addcontact.createdDate = newconsignee.addContact[0].createdDate;
        addcontact.emailaddress = newconsignee.addContact[0].emailaddress;
        addcontact.phoneNumber =newconsignee.addContact[0].phoneNumber;
        addcontact.address = newconsignee.addContact[0].address;
        addcontact.city  = newconsignee.addContact[0].city;
        addcontact.country = newconsignee.addContact[0].country;
        
        consignee.addContact.push(addcontact);
            
        consignee.companyname = newconsignee.companyname;
        consignee.companyaddress =newconsignee.companyaddress;
        consignee.companyemail = newconsignee.companyemail;
        consignee.companyphone =newconsignee.companyphone;
        consignee.createdDate = createdDate;

        console.log(consignee);
            
        consignee.save(function (err,result){
                if(err){
                    return next(new CustomError(err, 'Failure'));
                }
              //  return res.status(201).json({});
            })

        }

    });


}


// order Assign SalePerson
exports.assignSaleperson = async(req,res,next) => {

    if(!req.params.id) {
      return next(new CustomError(errors,'InvlidRequest'));      
    }

    const errors = validationResult(req);
  
    await Consignee.findOne({ _id: req.params.id }, async (err, consignee) => {
      if (err) {
        return next(new CustomError(err, 'UnknownError'));
      }

      if(isEmpty(consignee.saleperson))
      {
        var saleperson = new Saleperson();
        saleperson.firstName = req.body.firstName;
        saleperson.lastName = req.body.lastName;
        saleperson.email =req.body.email;
        saleperson.jobTitle =req.body.jobTitle;
        saleperson.city =req.body.city;
        saleperson.zone =req.body.zone;
        saleperson.country =req.body.country;
        saleperson.phoneNumber =req.body.phoneNumber;
        saleperson.userId = req.body._id;

        consignee.saleperson.push(saleperson);

        consignee.save(function (err, result) {
            if(err){
                return next(new customError(err, 'Failure'));

            }
            return res.status(201).json({});
        });  

      }

      else
      {

        consignee.saleperson[0].firstName = req.body.firstName;
        consignee.saleperson[0].lastName = req.body.lastName;
        consignee.saleperson[0].email =req.body.email;
        consignee.saleperson[0].jobTitle =req.body.jobTitle;
        consignee.saleperson[0].city =req.body.city;
        consignee.saleperson[0].zone =req.body.zone;
        consignee.saleperson[0].country =req.body.country;
        consignee.saleperson[0].phoneNumber =req.body.phoneNumber;
        consignee.saleperson[0].userId = req.body._id;

        consignee.save(function (err, result) {
            if(err){
                return next(new customError(err, 'Failure'));

            }
            return res.status(201).json({});
        }); 





      }

      

          
  

  });
}



//exports.generateCompanyID =  async(req,res,next) => {
async function generateCompanyID()
{

  let companyID ="";

 await  Consignee.find({}).sort({ createdDate:-1 }).limit(1).then((data) => {

    console.log(data);
    
    if(data == "")
    {
     companyID="CN-0001";
    }
    else
    {
    
    var id = data[0].companyID;
    var cID = id.split("-");
    var num ;
    if(cID[1] < '0009')
    {
      var n =  parseInt(cID[1])+1;
      num ="000"+n
    }
    else if(cID[1] < '009')
    {
      var n =  parseInt(cID[1])+1;
      num ="00"+n
    }
    else if(cID[1] < '099')
    {
      var n =  parseInt(cID[1])+1;
      num ="0"+n
    }
    else{

     num = parseInt(cID[1])+1;

    }

    companyID = "CN-"+num;

    }

  })

 return companyID;

}




function isEmpty(obj)
{
    for (var key in obj){
        if(obj.hasOwnProperty(key))
        return false;       
    }
    return true;
}

     

