var Rate = require('./../models/rate.model');
var Percentage = require('./../models/percentage.model');
const CustomError = require('../models/customError.model');
var Country = require('../models/country.model');

const constants = require('../helpers/constants');
const { check,validationResult } = require('express-validator');//An express.js middleware for validator


exports.addRate = [
    check('weight', 'weight is required').not().isEmpty(), async(req,res,next) => {

        let createdDate = new Date().toString();
        var rate = new Rate();
    
        rate.currency = req.body.currency;
        rate.type = req.body.type;
        rate.zone = req.body.zone;
        rate.country = req.body.country;
        rate.pcDoc = req.body.pcDoc;
        rate.rates = req.body.rates;
        rate.weight = req.body.weight;
        rate.createdBy = 'Admin';
        rate.createdDate = createdDate;
        

        rate.save(function (err, result) {
            if(err){
                return next(new customError(err, 'Failure'));

            }
            console.log(rate);
            return res.status(201).json({});
        });      
    }
];




exports.updateRate = [

    check('weight', 'weight is required').not().isEmpty(), async(req,res,next) => {

    if(!req.params.id) {
      return next(new CustomError(errors,'InvlidRequest'));      
    }
  
    const errors = validationResult(req);
    /*if (!errors.isEmpty()) {
      //return res.status(422).json({ errors: errors.array() });
      return next(new ValidationErrors(errors));
    }*/
    
    let updatedDate = new Date().toString();
    await Rate.findOne({ _id: req.params.id }, async (err, rate) => {
      if (err) {
        return next(new CustomError(err, 'UnknownError'));
  
      }
  
        rate.zone = req.body.zone;
        rate.country = req.body.country;
        rate.type = req.body.type;
        rate.pcDoc = req.body.pcDoc;
        rate.currency = req.body.currency;
        rate.rates = req.body.rates;
        rate.weight = req.body.weight;
        rate.updatedBy = 'Admin';
        rate.updatedDate = updatedDate;
  
        rate.save((error) => {
        if (error) { 
          return next(new CustomError(error, 'UnknownError'));
          }
  
       
        return res.status(201).json({});
      });
    
      });
    }  
];


exports.addPercent = [
    async(req,res,next) => {
      
      var o_type = req.body.o_type;
      var str = req.body.range;
      var percentage = req.body.percentages;
      var rng = str.split("-");
      var strt = rng[0];
      var end = rng[1]
      let ans;
      let update;
      i=0;

      Rate.countDocuments({ weight: { $gte: strt, $lt: end }  , currency : req.body.currency , type : req.body.type }, function(err,totalCount) {
        
      Rate.find({ weight: { $gte: strt, $lt: end } , currency : req.body.currency , type : req.body.type }, function(err, rate) {
     
      if (err) {
       return next(new CustomError('Error occured while fetching role \r\n' + err));  
      } 
       
       rate.forEach(function(item){

        if(item !=  null) {
        
          let updatedDate = new Date().toString();
          ans = parseInt(item.rates) * percentage / 100;

          if(o_type == 'Decrease')
          {
            update = parseInt(item.rates) - ans;
          }
          else
          {
            update =  parseInt(item.rates) + ans; 
          }
          
          rate[i].zone = item.zone;
          rate[i].type = item.type;
          rate[i].country = item.country;
          rate[i].pcDoc = item.pcDoc;
          rate[i].rates = update;
          rate[i].weight = item.weight;
          rate[i].updatedBy = 'Admin';
          rate[i].updatedDate = updatedDate;

          rate[i].save((error) => {
            if (error) { 
             return next(new CustomError(error, 'UnknownError'));
             }
     
          });

  
          ans = '';
         
           i++;
          }

          }); 

          if(totalCount  == i)
          {
            console.log(i);
           return res.status(201).json({});;
          } 

       
          
         
      
        });
    });
  }
];
  

exports.getAllRate = async(req,res,next) => {
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
      Rate.countDocuments(countFilter, function(err,totalCount) {
      Rate.find(queryFilter,{}, query, function(err, rates){
        if (err) 
        {
          return next(new CustomError(err));
        }
        var totalPages = Math.ceil(totalCount / size); 
        var hasMore = (totalCount > query.skip + size);
        var totalElements = Math.abs(hasMore == true? size : (totalCount - query.skip )); 
        response = {"data" : rates, "totalPages": totalPages, "totalElements":totalElements,"totalRecords" : totalCount, "hasMore" : hasMore};
        return res.json(response).status(200);
        });
      })
}
  
exports.deleteRateByID= async(req, res, next) => {
      if(!req.params.id) {
        next(new CustomError(errors,'InvlidRequest'));      
      }
      Rate.deleteOne({ _id: req.params.id }, (err) => 
      {
        if (err) {  return next(new CustomError(err)); }
        else
        {
          console.log("Rate has been deleted");
          res.status(204).json({});
        }
      });      
} 

exports.getRateByID = async(req,res,next) => 
{
  if(!req.params.id) {
    return next(new CustomError(err));
  }
  await Rate.findOne({ _id : req.params.id}, async (err,rate) =>{
    if (err) 
        {
          return next(new CustomError(err));
        }  
    response = rate;
    console.log(response);
    return res.json(response).status(200);
    })
 
}
  
exports.getRateByRateID = async(req,res,next) => 
{
    if(!req.params.id) {
      return next(new CustomError(err));
    }
    await Rate.findOne({ _id : req.params.id}, async (err,rate) =>{
      if (err) 
          {
            return next(new CustomError(err));
          }  
      response = rate;
      return res.json(response).status(200);
      })
   
}

function isEmpty(obj) 
{
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
}


exports.getAllWeightByCountry = async(req, res, next) => {
       
  Rate.find({ country: req.params.country } , (err, rate) => {
      if (err) {
        return next(new CustomError(err));
      }
response = rate;
return res.json(response).status(200);
});

};

exports.getRateByType = async(req, res, next) => {
       
  Rate.find({ weight: req.params.weight } , (err, rate) => {
      if (err) {
        return next(new CustomError(err));
      }
response = rate;
return res.json(response).status(200);
});

};


exports.getTypeByWeight = async(req, res, next) => {
       
  Rate.find({ type: req.params.type } , (err, rate) => {
      if (err) {
        return next(new CustomError(err));
      }
response = rate;
return res.json(response).status(200);
});

};


