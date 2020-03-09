var Category = require('./../models/category.model');
const CustomError = require('../models/customError.model');
var systemPermissions = require('../models/system-permissions.model');
const constants = require('../helpers/constants');
const { check,validationResult } = require('express-validator');//An express.js middleware for validator
var ObjectId = require('mongodb').ObjectID;



exports.getAllCategory = async(req,res,next) => 
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
    Category.countDocuments(countFilter, function(err,totalCount) {
        Category.find(queryFilter,{}, query, function(err, users){
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





exports.deleteCategoryByID= async(req,res,next) =>{

  if(!req.params.id) {
      next(new customError(err,'InvalidRequest'));
  }
  Category.deleteOne({_id: req.params.id }, (err) =>{
      if(err) { return next(new customError(err)); }
      else 
      {
          console.log('Category record has been deleted');

      }  
     return res.status(201).json({});
     });
}



exports.getCategoryByID = async(req,res,next) => 
{
  if(!req.params.id) {
    return next(new CustomError(err));
  }
  await Category.findOne({ _id : req.params.id}, async (err,user) =>{
    if (err) 
        {
          return next(new CustomError(err));
        }  
    response = user;
    return res.json(response).status(200);
    })
 
}



exports.createCategory= [

  async(req,res,next) =>{
    let createdDate = new Date();
    console.log('work');
    
    const cz = new Category();
    

    cz.category = req.body.category;
    cz.subcategory = req.body.subcategory;
    cz.type = req.body.type;
    cz.weight = req.body.weight;
    cz.price = req.body.price;
    cz.createdDate = createdDate;

    
    cz.save(function (err,result){
     if(err){
       return next(new CustomError(err, 'Failure'));
     }
     
     return res.status(201).json({});

    });
  }

];




exports.updateCategoryByID = [
   
  async(req,res,next)=>{
    
      console.log(req.params.id);
  
      const cz = new Category();
      cz.category = req.body.category;
      cz.subcategory = req.body.subcategory;
      cz.type = req.body.type;
      cz.weight = req.body.weight;
      cz.price = req.body.price;
  
       const errors = validationResult(req);
  if (!errors.isEmpty())
  {
      return next(new ValidationErrors(errors));
  }

  await Category.findOne({"_id" : ObjectId(req.params.id)} , async (err, cz) =>{
      if(err) {
          return next(new CustomError(err, 'UnknownError'));

      }
      let updatedDate = new Date();
      let createdDate = new Date();
      
     
      cz.category = req.body.category;
      cz.subcategory = req.body.subcategory;
      cz.type = req.body.type;
      cz.weight = req.body.weight;
      cz.price = req.body.price;
      cz.updatedDate = updatedDate;
      
          console.log(cz);
   
  cz.save((error) =>{
      if(error) {
          return next(new customError(error,'UnknownError'));
      }
      return res.status(201).json({});
  });

 });
     }
];
