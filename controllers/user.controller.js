var Role = require('./../models/role.model');
const CustomError = require('../models/customError.model');
var User = require('./../models/user.model');
var UserRole = require('./../models/userRole.model');
var systemPermissions = require('../models/system-permissions.model');
let agenda = require('../jobs/agenda');
const Mailer = require('../service/mailer');
const helper = require('../helpers/helper');

const constants = require('../helpers/constants');
const { check,validationResult } = require('express-validator');//An express.js middleware for validator
var ObjectId = require('mongodb').ObjectID;


/**
 * Get List of All users
 */

exports.getAllUsers = async(req,res,next) => 
{
  var pageNo = parseInt(req.query.page);
    var size = parseInt(req.query.limit);
    var sortColumn = (req.query.sort === undefined ? "createdAt" : req.query.sort);
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
    User.countDocuments(countFilter, function(err,totalCount) {
      User.find(queryFilter,{}, query, function(err, users){
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





exports.deleteUserByID= async(req,res,next) =>{

  if(!req.params.id) {
      next(new customError(err,'InvalidRequest'));
  }
  User.deleteOne({_id: req.params.id }, (err) =>{
      if(err) { return next(new customError(err)); }
      else 
      {
          console.log('User record has been deleted');

      }  
     return res.status(201).json({});
     });
}


/**
 * POST /user/status
 * Enable/disable User.
 */
exports.userStatus = async(req, res, next) => {
   
    User.findById(req.params.id, (err, user) => {
      if (err) { 
        return next(new CustomError(err, 'UnknownError'));
        }
        var status ="";
        if(req.params.status == true)
        {
          status = "Enable";
        }
        else
        {
          status = "Disable";
        }

        user.isEnabled = req.params.status;
      
        user.save((err) => {
        if (err) { 
        return next(new CustomError(err, 'UnknownError'));
        } 
  
       
        });

       return res.status(204).json({});
  });


};

/**
 * GET /userbyUserID
 * Enable/disable User.
*/

exports.getUsersByUserID = async(req,res,next) => 
{
  if(!req.params.id) {
    return next(new CustomError(err));
  }
  await User.findOne({ _id : req.params.id}, async (err,user) =>{
    if (err) 
        {
          return next(new CustomError(err));
        }  
    response = user;
    return res.json(response).status(200);
    })
 
}

/**
 * GET /user/Counterpart
 * 
*/
exports.getAllCounterpart = async(req, res, next) => {
  city = "";
  
  

      Role.find({ name: "CounterPart"}, (err, role) => {
        if (err) {

          return next(new CustomError('Error occured while fetching role \r\n' + err));
         //   logger.error(new CustomError('Error occured while fetching role \r\n' + err));
        } 

        if(req.params.city != 'all' )  
        {

          User.find({ userRoles: { $elemMatch: { roleId: role[0]._id } } , city : req.params.city  }, (err, users) => {
              if (err) {
                return next(new CustomError('Error occured while fetching users for sending push notifications  \r\n ' + err));
                //  logger.error(new CustomError('Error occured while fetching users for sending push notifications  \r\n ' + err));
              }
              response = users;
              return res.json(response).status(200); 
          });
        }
        else
        {

          User.find({ userRoles: { $elemMatch: { roleId: role[0]._id } } }, (err, users) => {
            if (err) {
              return next(new CustomError('Error occured while fetching users for sending push notifications  \r\n ' + err));
              //  logger.error(new CustomError('Error occured while fetching users for sending push notifications  \r\n ' + err));
            }
            response = users;
            return res.json(response).status(200); 
        });


        }


        
     });
};

//Get Sales User
exports.getAllSalesUser = async(req, res, next) => {
    
  Role.find({ name: "Sales"}, (err, role) => {
    if (err) {

      return next(new CustomError('Error occured while fetching role \r\n' + err));
     //   logger.error(new CustomError('Error occured while fetching role \r\n' + err));
    } 


      User.find({ userRoles: { $elemMatch: { roleId: role[0]._id } } }, (err, users) => {
        if (err) {
          return next(new CustomError('Error occured while fetching users for sending push notifications  \r\n ' + err));
          //  logger.error(new CustomError('Error occured while fetching users for sending push notifications  \r\n ' + err));
        }
        response = users;
        return res.json(response).status(200); 
    });

  });
};

/**
 * Post /user/createUser
 * 
*/
exports.createUser= [ async(req,res,next) =>{


  User.findOne({ email: req.body.email }, (err, existingUser) => {
    const randomPassword = helper.generatePassword(); //rand.generatePassword(defaultPasswordConfig);
    if (err) { return next(new CustomError(err)); }
    if (existingUser) {
      return next(new CustomError('User with that email address already exists.', 'UserFailure', 409));
    }


      let createdDate = new Date();
      const user = new User();
    //  user.userName = req.body.userName;
      user.firstName = req.body.firstName;
      user.lastName  = req.body.lastName;
      user.email = req.body.email;
      user.jobTitle = req.body.jobTitle;
      user.phoneNumber = req.body.phoneNumber;
      user.city = req.body.city;
      user.zone = req.body.zone;
      user.country = req.body.country;
      user.password = randomPassword;
      user.isEnabled = req.body.isEnabled;
      user.createdDate = createdDate;
      user.createdBy = req.user.firstName+" "+req.user.lastName;

      const userRole = new UserRole({

      roleId : req.body.roles[0].roleId,
      name : req.body.roles[0].name,
      discriminator: req.body.roles[0].description
      });
     
      user.userRoles.push(userRole);
      user.save(function (err,result){
      if(err){
        return next(new CustomError(err, 'Failure'));
      }

      fullName = req.body.firstName + " " +req.body.lastName;;
      
      agenda.now('new-user', { fullName: fullName,password : randomPassword ,role : req.body.roles[0].name, email: req.body.email, type: "User" });
      return res.status(201).json({});

    });

  });
  }

];




exports.updateUserByID = [ async(req,res,next)=>{
    
      console.log(req.params.id);
      let date = new Date().toString();
  
      const errors = validationResult(req);
      if (!errors.isEmpty())
      {
          return next(new ValidationErrors(errors));
      }

      await User.findOne({"_id" : ObjectId(req.params.id)} , async (err, user) =>{
      if(err) {
          return next(new CustomError(err, 'UnknownError'));
      }
          let updatedDate = new Date();
        //  user.userName = req.body.userName;
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.updatedDate = updatedDate;
          user.email = req.body.email;
          user.city = req.body.city;
          user.country = req.body.country;
          user.jobTitle = req.body.jobTitle;
          user.phoneNumber = req.body.phoneNumber;
          user.updatedDate =updatedDate;
          user.updatedBy = req.user.firstName+" "+req.user.lastName;

        /*  user.userRoles[0].roleId = req.body.userRoles[0].roleId;
          user.userRoles[0].name = req.body.userRoles[0].name;
          user.userRoles[0].discriminator = req.body.userRoles[0].description;*/

          user.save((error) =>{
              if(error) {
                  return next(new customError(error,'UnknownError'));
              }
              return res.status(201).json({});
          });

 });
     }
];

/**
 * POST user/updatePassword
 * Update current password.
 */
exports.updatePassword = async (req, res, next) => {
  //req.assert('newPassword', 'Password must be at least 8 characters long').len(8);
  //req.assert('confirmPassword', 'Passwords do not match').equals(req.body.newPassword);

  // const errors = req.validationErrors();
  // if (errors) {
  //   return next(new CustomError(errors, 'ValidationFaild'));
  // }
  passwordUpdate(req, res, next);
};


/**
 * Password update function
 */
async function passwordUpdate(req, res, next) {
pass = "";
  User.findById({ _id: req.user.id }, (err, user) => {
    if (err) { return next(new CustomError(err)); }

    //user.comparePassword (req.body.currentPassword, async (err, isMatch) => {
  //     if (err) {
  //       return next(new CustomError(err));
  //     }
  //     if (isMatch) {
         pass = req.body.newPassword
         console.log(pass);
         user.password = req.body.newPassword;
         user.save((err) => {
           if (err) {
             return next(new CustomError(err));
          }
          //var fullName = "Talha Shaikh";
          agenda.now('pass-change', { fullName: pass, email: "talha.shaikh@een.group", type: "Client" });
           return res.status(200).json({});
         });
      // }
  //     else {
  //       return next(new CustomError('Password is incorrect', 'UpdatePasswordfailure', 400));
  //     }

  //   });
   });


}
