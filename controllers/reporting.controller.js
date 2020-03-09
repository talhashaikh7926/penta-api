var Consignee = require('../models/consignee.model');
var Order = require('../models/order.model');
var Lead = require('../models/lead.model');
const Mailer = require('../service/mailer');
var Consignee = require('../models/consignee.model');
var ContactPerson = require('../models/contactperson.model');
var Pickup = require('../models/pickup.model');
var OrderStatus = require('../models/orderStatus.model');
var CounterPart =  require('../models/counterpart.model');
const customError = require('../models/customError.model');
const { check,validationResult } = require('express-validator');//An express.js middleware for validator
const consigneeController  =  require('./consignee.controller');
let agenda = require('../jobs/agenda');
const SendMail = require('../models/send-mail.model');
var ObjectId = require('mongodb').ObjectID;


exports.getAllSale = async(req,res,next) => {

    var pageNo = parseInt(req.query.page);
    var size =   parseInt(req.query.limit);
    var q = (req.query.q != undefined && req.query.q.length > 0 ? req.query.q : null);
    var sortColumn = (req.query.sort === undefined ? "createdDate" : req.query.sort);
    var order = (req.query.order === undefined ? "desc" : req.query.order);
    var skip =  size * (pageNo - 1)

    if(pageNo < 0 || pageNo === 0) 
    {  
      return next(new CustomError(  "invalid page number, should start with 1", "PaginationError", 400));
    }
    
    var  queryFilter = {};
    if(q != null && !isEmpty(q) && q != "undefined")
    {

      var splited = q.split("|");
      var zone = splited[0];
      var city = splited[1];
      var weight = splited[2];
      var shipmentType = splited[5];

      var search =  [];

      search.push({"status": "2"});

      if(splited[0] != "")
      {
        search.push({ "consignee" : {$elemMatch: {"saleperson.zone": zone}}} );
      }

      if(splited[1] != "")
      {
        search.push({"consignee": {$elemMatch: {"saleperson.city": city}}});
      }

      if(splited[2] != "")
      {
        search.push({"lead": {$elemMatch: {"contentWeight": weight}}});
      }

      if(splited[3] != "" && splited[4] =="")
      {
       var d = splited[3].split("/");
            
       var newDate =    d[2]+"-"+d[0]+"-"+d[1];
       var timeStamp =  new Date(newDate).getTime();
       console.log(timeStamp);

        search.push({"timestamp" : {$gt:timeStamp} });
      }

      if(splited[3] != "" && splited[4] != "")
      {
       var d = splited[3].split("/");
       var d1 = splited[4].split("/");
            
       var newDate =    d[2]+"-"+d[0]+"-"+d[1];
       var newDate1 =   d1[2]+"-"+d1[0]+"-"+d1[1];

       var from =  new Date(newDate).getTime();
       var to =    new Date(newDate1).getTime();


       console.log(timeStamp);
      

        search.push({ "timestamp": { $gt: from,  $lt: to}});
      }

      console.log(search);
      queryFilter["$and"] = search;
    }
    else
    {    
      queryFilter ={ status: '2' }
    }


    Order.aggregate(
        [
            { $match:   queryFilter },
            { '$group': { 
                '_id': {consignee : '$consignee.companyName', saleperson : '$consignee.saleperson.email' },
                'total': { '$sum': 1 },
            } },

        ], function (err, count) {
            
        Order.aggregate(
        [
            {
                $match: queryFilter
            },
            { '$group': { 
                '_id': {consignee : '$consignee.companyName', saleperson : '$consignee.saleperson.email' },
                'total': { '$sum': 1 },
                'docs': { '$push': '$$ROOT' }
            } }, 
          { $skip: skip },  
          { $limit: size },  
          { $sort: {createdDate: -1} }
        ], function (err, result) {

         
            var totalCount =count.length;
            var totalPages = Math.ceil(totalCount / size); 
            var hasMore = (totalCount > skip + size);
            var totalElements = Math.abs(hasMore == true? size : (totalCount - skip )); 
            response = {"data" : result, "totalPages": totalPages, "totalElements":totalElements,"totalRecords" : totalCount, "hasMore" : hasMore};
            return res.json(response).status(200);
             
        });

    });



     
      
    
    

  /*  var pageNo = parseInt(req.query.page);
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
    })*/
}



exports.getAllShipperSale = async(req,res,next) => {

  var pageNo = parseInt(req.query.page);
    var size =   parseInt(req.query.limit);
    var q = (req.query.q != undefined && req.query.q.length > 0 ? req.query.q : null);
    var sortColumn = (req.query.sort === undefined ? "createdDate" : req.query.sort);
    var order = (req.query.order === undefined ? "desc" : req.query.order);
    var skip =  size * (pageNo - 1)

    if(pageNo < 0 || pageNo === 0) 
    {  
      return next(new CustomError(  "invalid page number, should start with 1", "PaginationError", 400));
    }
    
    var  queryFilter = {};
    if(q != null && !isEmpty(q) && q != "undefined")
    {

      var splited = q.split("|");
      var origin = splited[0];
      var destination = splited[1];
      var shipmentType = splited[4];

      var search =  [];

      search.push({"status": "2"});

      if(splited[0] != "")
      {
        search.push({ "lead" : {$elemMatch: {"origin": origin}}} );
      }

      if(splited[1] != "")
      {
        search.push({"lead": {$elemMatch: {"destination": destination}}});
      }

      if(splited[2] != "" && splited[3] =="")
      {
       var d = splited[2].split("/");
            
       var newDate =    d[2]+"-"+d[0]+"-"+d[1];
       var timeStamp =  new Date(newDate).getTime();
       console.log(timeStamp);

        search.push({"timestamp" : {$gt:timeStamp} });
      }

      if(splited[2] != "" && splited[3] != "")
      {
       var d = splited[2].split("/");
       var d1 = splited[3].split("/");
            
       var newDate =    d[2]+"-"+d[0]+"-"+d[1];
       var newDate1 =   d1[2]+"-"+d1[0]+"-"+d1[1];

       var from =  new Date(newDate).getTime();
       var to =    new Date(newDate1).getTime();

       console.log(timeStamp);
        search.push({ "timestamp": { $gt: from,  $lt: to}});
      }

      console.log(search);
      queryFilter["$and"] = search;
    }
    else
    {    
      queryFilter ={ status: '2' }
    }



  Order.aggregate(
      [
          { $match: queryFilter },
          { '$group': { 
              '_id': {shipper : '$shipper.company' ,consignee : '$consignee.companyName' },
              'total': { '$sum': 1 },
          } },

      ], function (err, count) {
          
      Order.aggregate(
      [
          {
              $match: queryFilter
          },
          { '$group': { 
              '_id': {shipper : '$shipper.company' ,consignee : '$consignee.companyName' },
              'total': { '$sum': 1 },
              'docs': { '$push': '$$ROOT' }
          } }, 
        { $skip: skip },  
        { $limit: size },  
        { $sort: {createdDate: -1} }
      ], function (err, result) {

          var totalCount =count.length;
          var totalPages = Math.ceil(totalCount / size); 
          var hasMore = (totalCount > skip + size);
          var totalElements = Math.abs(hasMore == true? size : (totalCount - skip )); 
          response = {"data" : result, "totalPages": totalPages, "totalElements":totalElements,"totalRecords" : totalCount, "hasMore" : hasMore};
          return res.json(response).status(200);
           
      });

  });

}


exports.getAllConsigneeSale = async(req,res,next) => {

  var pageNo = parseInt(req.query.page);
  var size =   parseInt(req.query.limit);
  var sortColumn = (req.query.sort === undefined ? "createdDate" : req.query.sort);
  var order = (req.query.order === undefined ? "desc" : req.query.order);
  var skip =  size * (pageNo - 1)

  if(pageNo < 0 || pageNo === 0) 
  {  
    return next(new CustomError(  "invalid page number, should start with 1", "PaginationError", 400));
  }


  Order.aggregate(
      [
        //  { $match: { status: "2" } },
          { '$group': { 
              '_id': {consignee : '$consignee.companyName' },
              'total': { '$sum': 1 },
          } },

      ], function (err, count) {
          
      Order.aggregate(
      [
        /*  {
              $match: { status: "2" }
          },*/
          { '$group': { 
              '_id': {consignee : '$consignee.companyName' },
              'total': { '$sum': 1 },
              'docs': { '$push': '$$ROOT' }
          } }, 
        { $skip: skip },  
        { $limit: size },  
        { $sort: {createdDate: -1} }
      ], function (err, result) {

          var totalCount =count.length;
          var totalPages = Math.ceil(totalCount / size); 
          var hasMore = (totalCount > skip + size);
          var totalElements = Math.abs(hasMore == true? size : (totalCount - skip )); 
          response = {"data" : result, "totalPages": totalPages, "totalElements":totalElements,"totalRecords" : totalCount, "hasMore" : hasMore};
          return res.json(response).status(200);
           
      });

  });

}

function isEmpty(obj)
{
    for (var key in obj){
        if(obj.hasOwnProperty(key))
        return false;       
    }
    return true;
}