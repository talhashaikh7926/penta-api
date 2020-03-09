var Role = require('./../models/role.model');
const CustomError = require('../models/customError.model');
var User = require('./../models/user.model');
var systemPermissions = require('../models/system-permissions.model');

const constants = require('../helpers/constants');
const { check,validationResult } = require('express-validator');//An express.js middleware for validator

exports.getAllRoles = async(req,res,next) => {
  var pageNo = parseInt(req.query.page);
  var size = parseInt(req.query.limit);
  var sortColumn = (req.query.sort === undefined ? "createdAt" : req.query.sort);
  var order = (req.query.order === undefined ? "desc" : req.query.order);
  var q = (req.query.q != undefined && req.query.q.length > 0 ? req.query.q : null);
  var countFilter = {}, queryFilter = {};
  if(q != null && !isEmpty(q) && q != "undefined")
  {
    //await Role.ensureIndexes();
    //queryFilter["$text"] = {"$search" : q};

    queryFilter["$or"] = [
      { "name" : { $regex: q, '$options': 'i' }},
      { "description": { $regex: q, '$options': 'i' }}
    ];
    countFilter["$or"] = [
      { "name" : { $regex: q, '$options': 'i' }},
      { "description": { $regex: q, '$options': 'i' }}
    ];
  }
  queryFilter["$and"] = [
    {"name" : { $nin: [constants.Administrator]}}
  ];
  countFilter["$and"] = [
    {"name" : { $nin: [constants.Administrator]}}
  ];
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
  Role.countDocuments(countFilter, function(err,totalCount) {
  Role.find(queryFilter,{}, query, function(err, roles){
    if (err) 
    {
      return next(new CustomError(err));
    }
    var totalPages = Math.ceil(totalCount / size); 
    var hasMore = (totalCount > query.skip + size);
    var totalElements = Math.abs(hasMore == true? size : (totalCount - query.skip )); 
    response = {"data" : roles, "totalPages": totalPages, "totalElements":totalElements,"totalRecords" : totalCount, "hasMore" : hasMore};
    return res.json(response).status(200);
    });
  })
   console.log(req.user);
}

// exports.getAllRoles = async(req,res,next) => 
// {
//   queryFilter = {};
//   var query = {};
//   var columns={};
//   // var columns={name:true,_id:true};
//   Role.find(queryFilter,  query, function(err, roles){
//     if (err) 
//     {
//        return next(new CustomError(err));
//     };
//    return res.json(roles).status(200);
//   });
// }


exports.getPermissionsByRoleID = async(req,res,next) => 
{
  if(!req.params.id) {
    return next(new CustomError(err));
  }
  await Role.findOne({ _id : req.params.id}, async (err,permissions) =>{
    if (err) 
        {
          return next(new CustomError(err));
        }  
    response = permissions.roleClaims;
    return res.json(response).status(200);
    })
 
}

exports.getRoleByRoleID = async(req,res,next) => 
{
  if(!req.params.id) {
    return next(new CustomError(err));
  }
  await Role.findOne({ _id : req.params.id}, async (err,role) =>{
    if (err) 
        {
          return next(new CustomError(err));
        }  
    response = role;
    return res.json(response).status(200);
    })
 
}
exports.getSystemPermissions = async (req,res,next)=> {
  await systemPermissions.find({  }, async (err, objectives) => {
    if (err) {
      return next(new CustomError(err, 'UnknownError'));
    }
    res.status(200).send(objectives);
  });
}


exports.addRole =  [

  check('name', 'name is required').not().isEmpty(),
  check('description', 'description is required').not().isEmpty(),
  async (req, res, next) => {


    console.log(req.user);
  

 /* await User.findOne({ _id: req.user._id }, (err, user) => {
      if (err) {
          return next(new CustomError(err, 'UserNotFound'));
      }
      if(user)
      {*/
          var role = new Role();
          role.concurrencyStamp  = req.body.concurrencyStamp , 
          role.createdBy= req.body.createdBy,
          role.createdDate = req.body.createdDate ,
          role.description = req.body.description, 
          role.name = req.body.name,
          role.roleClaims = req.body.roleClaims,
          role.normalizedName= req.body.normalizedName,
          role.updatedBy= req.body.updatedBy,
          role.updatedDate = req.body.updatedDate,   
          role.save(function (error, result) {
              if (error) {
                  return next(new CustomError(error, 'Failure'));
              } 
             

              return res.status(201).json({});
          });
     /* }
      else{
          return next(new CustomError(err, 'UserNotFound'));
      }
  });*/

  }
];

  exports.deleteRoleByID= async(req, res, next) => {
    if(!req.params.id) {
      next(new CustomError(errors,'InvlidRequest'));      
    }
      Role.deleteOne({ _id: req.params.id }, (err) => 
      {
        if (err) {  return next(new CustomError(err)); }
        else
        {
          console.log("Role has been deleted");
  
            
          
          res.status(204).json({});
        }
      });
  
   
  } 


exports.updateRoleByID = [

  check('name', 'name is required').not().isEmpty(),
  check('description', 'description is required').not().isEmpty(),
   async (req, res, next) => {
  if(!req.params.id) {
    return next(new CustomError(errors,'InvlidRequest'));      
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    return next(new ValidationErrors(errors));
  }
  
  
  await Role.findOne({ _id: req.params.id }, async (err, role) => {
    if (err) {
      return next(new CustomError(err, 'UnknownError'));
    }
    role.concurrencyStamp  = req.body.concurrencyStamp , 
    role.createdBy=req.body.createdBy,
    role.createdDate = req.body.createdDate ,
    role.description = req.body.description, 
    role.name = req.body.name,
    role.roleClaims = req.body.roleClaims,
    role.normalizedName= req.body.normalizedName,
    role.updatedBy= req.body.updatedBy,
    role.updatedDate = req.body.updatedDate, 

    role.save((error) => {
      if (error) { 
        return next(new CustomError(error, 'UnknownError'));
        }

     
      return res.status(201).json({});
    });
  
    });
  }  
 ];
  function isEmpty(obj) 
  {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }


  