var  Shipper = require('../models/shipper.model');
const CustomError = require('../models/customError.model');
var systemPermissions = require('../models/system-permissions.model');
const constants = require('../helpers/constants');
const { check,validationResult } = require('express-validator');//An express.js middleware for validator
var ObjectId = require('mongodb').ObjectID;



exports.getAllShipper = async(req,res,next) => 
{
    var pageNo = parseInt(req.query.page);
    var size = parseInt(req.query.limit);
    var sortColumn = (req.query.sort === undefined ? "createdDate" : req.query.sort);
    var order = (req.query.order === undefined ? "desc" : req.query.order);
    var q = (req.query.q != undefined && req.query.q.length > 0 ? req.query.q : null);
    var countFilter = {}, queryFilter = {};
  
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
    Shipper.countDocuments(countFilter, function(err,totalCount) {
        Shipper.find(queryFilter,{}, query, function(err, users){
      if (err) 
      {
        return next(new CustomError(err));
      }
      var totalPages = Math.ceil(totalCount / size); 
      var hasMore = (totalCount > query.skip + size);
      var totalElements = Math.abs(hasMore == true? size : (totalCount - query.skip )); 
      response = {"data" : users, "totalPages": totalPages, "totalElements":totalElements,"totalRecords" : totalCount, "hasMore" : hasMore};
      return res.json(response).status(200);
      });
    })
}





exports.deleteShipperByID= async(req,res,next) =>{

  if(!req.params.id) {
      next(new customError(err,'InvalidRequest'));
  }
  Shipper.deleteOne({_id: req.params.id }, (err) =>{
      if(err) { return next(new customError(err)); }
      else 
      {
          console.log('Category record has been deleted');

      }  
     return res.status(201).json({});
     });
}



exports.getShipperByID = async(req,res,next) => 
{
  if(!req.params.id) {
    return next(new CustomError(err));
  }
  await Shipper.findOne({ _id : req.params.id}, async (err,user) =>{
    if (err) 
        {
          return next(new CustomError(err));
        }  
    response = user;
    return res.json(response).status(200);
    })
 
}



exports.createShipper= [

  async(req,res,next) =>{


    Shipper.findOne({ company: req.body.company }, (err, existingShipper) => {
      if (err) { return next(err); }
      if (existingShipper) {
        return next(new CustomError('Shipper with that name already exists.', 'ShipperCreationFailure', 409));
      }

    const shipper = new Shipper();

    generateShipperID().then(function (shipperID) {

    shipper.shipperID = shipperID;
    shipper.company = req.body.company;
    shipper.fullName = req.body.fullName;
    shipper.email = req.body.email;
    shipper.phone = req.body.phone;
    shipper.address = req.body.address;
    shipper.city = req.body.city;
    shipper.country = req.body.country;
    shipper.createdDate = req.body.createdDate;
    shipper.createdBy =req.user.firstName+" "+req.user.lastName;
    console.log(shipper);
    
    shipper.save(function (err,result){
     if(err){
       return next(new CustomError(err, 'Failure'));
     }
     
     return res.status(201).json({});

    });

    });


  });
  }

];




exports.updateShipperByID = [
   
  async(req,res,next)=>{
    
      const errors = validationResult(req);
      if (!errors.isEmpty())
      {
          return next(new ValidationErrors(errors));
      }

      await Shipper.findOne({"_id" : ObjectId(req.params.id)} , async (err, shipper) =>{
      if(err) {
          return next(new CustomError(err, 'UnknownError'));
      }
      
      shipper.company = req.body.company;
      shipper.fullName = req.body.fullName;
      shipper.email = req.body.email;
      shipper.phone = req.body.phone;
      shipper.address = req.body.address;
      shipper.city = req.body.city;
      shipper.country = req.body.country;
      shipper.updatedDate = req.body.updatedDate;
      shipper.updatedBy =req.user.firstName+" "+req.user.lastName;
  
      shipper.save((error) =>{
      if(error) {
          return next(new customError(error,'UnknownError'));
      }
      return res.status(201).json({});
      });

    });
    }
];


/**
 * Get Shipper By Name
*/

exports.getShipperByName = async(req, res, next) => {

  Shipper.find({ company: req.params.name } , (err, shipper) => {
        if (err) {
            logger.error(new CustomError('Error occured while fetching users for sending push notifications  \r\n ' + err));
        }
response = shipper;
return res.json(response).status(200);
});

};


//exports.generateShipperID =  async(req,res,next) => {
  async function generateShipperID()
  {
  
    let shipperID ="";
  
   await  Shipper.find({}).sort({ createdDate:-1 }).limit(1).then((data) => {
  
      console.log(data);
      
      if(data == "")
      {
        shipperID="SH-0001";
      }
      else
      {
      
      var id = data[0].shipperID;
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
  
      shipperID = "SH-"+num;
  
      }
  
    })
  
   return shipperID;
  
  }
  
  
  
  
  function isEmpty(obj)
  {
      for (var key in obj){
          if(obj.hasOwnProperty(key))
          return false;       
      }
      return true;
  }
  
