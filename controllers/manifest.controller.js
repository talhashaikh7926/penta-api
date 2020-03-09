var Manifest = require('./../models/manifest.model');
var ManifestFile = require('./../models/manifestFile.model');
const CustomError = require('../models/customError.model');
const constants = require('../helpers/constants');
const { check,validationResult } = require('express-validator');//An express.js middleware for validator


exports.addManifest =    async (req, res, next) => {
    
   var type = req.body.type;
   var city = req.body.city;
   var data =  req.body.data;
   let createdDate = new Date().toString();
   data.shift();
   data = data.filter(Boolean);

        var i = 0;
        data.forEach(function(item){

        var manifest = new Manifest();
        var manifestFile =  new ManifestFile();
        var cells =  csvToArray(data[i]);

        if(i == 1)
        {
         if(type == "UBX")
         {
          manifestFile.from  = 'UBX';
          manifestFile.to = 'PENTA COURIERS';
          manifestFile.city = city;
          manifestFile.flight =cells[1];
          manifestFile.mawb =cells[2];
          manifestFile.weight = "";
          manifestFile.pieces = "";
          manifestFile.departureDate = "";
          manifestFile.arrivalDate= "";
          manifestFile.createdBy=req.user.firstName+ " " +req.user.lastName;
          manifestFile.createdDate=createdDate;
         }
         else if(type == "UDS")
         {
          manifestFile.from  = 'UDS';
          manifestFile.to = 'PENTA COURIERS';
          manifestFile.city = city;
          manifestFile.flight =cells[0];
          manifestFile.mawb =cells[49];
          manifestFile.weight = "";
          manifestFile.pieces = "";
          manifestFile.departureDate = "";
          manifestFile.arrivalDate= "";
          manifestFile.createdBy=req.user.firstName+ " " +req.user.lastName;
          manifestFile.createdDate=createdDate;
         }

         else if(type == "Antron")
         {
          manifestFile.from  = 'Antron';
          manifestFile.to = 'PENTA COURIERS';
          manifestFile.city = city;
          manifestFile.flight =cells[2];
          manifestFile.mawb =cells[0];
          manifestFile.weight = "";
          manifestFile.pieces = cells[4];
          manifestFile.departureDate = "";
          manifestFile.arrivalDate= "";
          manifestFile.createdBy=req.user.firstName+ " " +req.user.lastName;
          manifestFile.createdDate=createdDate;
         }

         manifestFile.save(function (error, result) {
          if (error) {
              return next(new CustomError(error, 'Failure'));
          }  
         // return res.status(201).json({});
          });         


        }

        if(data[i] != "") {}
 
             if(type == "UBX")
             {
              manifest.from  = 'EZ Worldwide Express / UBX';
              manifest.to = 'PENTA COURIERS';
              manifest.city = city;
              manifest.flight =cells[1];
              manifest.flightDate ='';
              manifest.lmawb =null;
              manifest.cbvNumber = cells[2];
              manifest.awb =cells[0];
              manifest.mawb =cells[2];
              manifest.mawbDate ='';
              manifest.hawb = '';
              manifest.hawbDate ='';
              manifest.billDate ='';
              manifest.shipDate ='';
              manifest.consignorCopmany =cells[3];
              manifest.consignorName =cells[4];
              manifest.consignorEmail =cells[13];
              manifest.consignorAddress1 =cells[5];
              manifest.consignorAddress2 =cells[6];
              manifest.consignorAddress3 =cells[7];
              manifest.consignorCity =cells[8];
              manifest.consignorState =cells[9];
              manifest.consignorCountry =cells[11];
              manifest.consignorPostalcode =cells[10];
              manifest.consignorPhone =cells[12];
              manifest.consigneeCopmany =cells[14];
              manifest.consigneeName =cells[15];
              manifest.consigneeEmail =cells[24];
              manifest.consigneeAddress1 =cells[16];
              manifest.consigneeAddress2 =cells[17];
              manifest.consigneeAddress3 =cells[18];
              manifest.consigneeCity =cells[19];
              manifest.consigneeState =cells[21];
              manifest.consigneeCountry =cells[22];
              manifest.consigneePostalcode =cells[20];
              manifest.consigneePhone =cells[23];
              manifest.duty =cells[25];
              manifest.weight =cells[30];
              manifest.volumeWeight =cells[31];
              manifest.changeWeight = '';
              manifest.invoiceWeight = '';
              manifest.pieces = cells[29];
              manifest.piecesHAWB = '';
              manifest.bagNumber =cells[26];
              manifest.totalBag =cells[50];
              manifest.dimenssion =cells[32];
              manifest.totalWeight =cells[53];
              manifest.description ='';
              manifest.documentBag =cells[51];
              manifest.customBag =cells[52];
              manifest.packagingType =cells[27];
              manifest.packageType =cells[28];
              manifest.validFalg =cells[54];
              manifest.agentCopmany =cells[33];
              manifest.agentName =cells[35];
              manifest.agentEmail ='';
              manifest.agentAddress1 =cells[36];
              manifest.agentAddress2 =cells[37];
              manifest.agentAddress3 =cells[38];
              manifest.agentCity =cells[39];
              manifest.agentState =cells[40];
              manifest.agentCountry =cells[42];
              manifest.agentPostalcode =cells[41];
              manifest.agentPhone =cells[43];
              manifest.agentFax =cells[44];
              manifest.agentContactPerson =cells[45];
              manifest.agentMAWBNumber =cells[48];
              manifest.mawbTemp=cells[47];
              manifest.customValue ='';
              manifest.paidBy ='';
              manifest.createdBy=req.user.firstName+ " " +req.user.lastName;
              manifest.createdDate=createdDate;

             }
             else if(type == "UDS")
             {

              manifest.from  = 'Universal Delivery Solutions Ltd';
              manifest.to = 'PENTA COURIERS';
              manifest.city = city;
              manifest.flight =cells[0];
              manifest.flightDate ='';
              manifest.lmawb =null;
              manifest.cbvNumber = '';
              manifest.awb =cells[1];
              manifest.mawb ='';
              manifest.mawbDate ='';
              manifest.hawb = '';
              manifest.hawbDate ='';
              manifest.billDate =cells[2];
              manifest.shipDate =cells[3];
              manifest.consignorCopmany =cells[4];
              manifest.consignorName =cells[5];
              manifest.consignorEmail =cells[6];
              manifest.consignorAddress1 =cells[7];
              manifest.consignorAddress2 =cells[8];
              manifest.consignorAddress3 ='';
              manifest.consignorCity =cells[9];
              manifest.consignorState =cells[10];
              manifest.consignorCountry =cells[12];
              manifest.consignorPostalcode =cells[11];
              manifest.consignorPhone =cells[13];
              manifest.consigneeCopmany =cells[14];
              manifest.consigneeName =cells[15];
              manifest.consigneeEmail =cells[16];
              manifest.consigneeAddress1 =cells[17];
              manifest.consigneeAddress2 =cells[18];
              manifest.consigneeAddress3 ='';
              manifest.consigneeCity =cells[19];
              manifest.consigneeState =cells[20];
              manifest.consigneeCountry =cells[22];
              manifest.consigneePostalcode =cells[21];
              manifest.consigneePhone =cells[23];
              manifest.duty =cells[24];
              manifest.weight =cells[28];
              manifest.volumeWeight =cells[29];
              manifest.changeWeight = '';
              manifest.invoiceWeight = '';
              manifest.pieces = cells[26];
              manifest.piecesHAWB = '';
              manifest.bagNumber =cells[27];
              manifest.totalBag =cells[30];
              manifest.dimenssion =cells[34];
              manifest.totalWeight ='';
              manifest.description =cells[32];
              manifest.documentBag ='';
              manifest.customBag ='';
              manifest.packagingType ='';
              manifest.packageType ='';
              manifest.validFalg ='';
              manifest.agentCopmany ='';
              manifest.agentName ='';
              manifest.agentEmail ='';
              manifest.agentAddress1 ='';
              manifest.agentAddress2 ='';
              manifest.agentAddress3 ='';
              manifest.agentCity ='';
              manifest.agentState ='';
              manifest.agentCountry ='';
              manifest.agentPostalcode ='';
              manifest.agentPhone ='';
              manifest.agentFax ='';
              manifest.agentContactPerson ='';
              manifest.agentMAWBNumber ='';
              manifest.mawbTemp='';
              manifest.customValue ='';
              manifest.paidBy ='';
              manifest.createdBy=req.user.firstName+ " " +req.user.lastName;
              manifest.createdDate=createdDate;

             }
             else if(type == "Antron")
             {

              manifest.from  = 'Antron Supply Chain Co Limited';
              manifest.to = 'PENTA COURIERS';
              manifest.city = city;
              manifest.flight =cells[2];
              manifest.flightDate =cells[3];
              manifest.lmawb =null;
              manifest.cbvNumber = '';
              manifest.awb ='';
              manifest.mawb =cells[0];
              manifest.mawbDate =cells[1];
              manifest.hawb =cells[6];
              manifest.hawbDate =cells[7];
              manifest.billDate ='';
              manifest.shipDate ='';
              manifest.consignorCopmany =cells[8];
              manifest.consignorName ='';
              manifest.consignorEmail ='';
              manifest.consignorAddress1 =cells[9];
              manifest.consignorAddress2 =cells[10];
              manifest.consignorAddress3 ='';
              manifest.consignorCity =''
              manifest.consignorState =cells[11];
              manifest.consignorCountry =cells[12];
              manifest.consignorPostalcode ='';
              manifest.consignorPhone ='';
              manifest.consigneeCopmany =cells[13];
              manifest.consigneeName =cells[19];
              manifest.consigneeEmail ='';
              manifest.consigneeAddress1 =cells[14];
              manifest.consigneeAddress2 =cells[15];
              manifest.consigneeAddress3 ='';
              manifest.consigneeCity ='';
              manifest.consigneeState =cells[16];
              manifest.consigneeCountry =cells[17];
              manifest.consigneePostalcode ='';
              manifest.consigneePhone =cells[18];
              manifest.duty =cells[23];
              manifest.weight =cells[21];
              manifest.volumeWeight =cells[5];
              manifest.changeWeight = cells[22];
              manifest.invoiceWeight =cells[28];
              manifest.pieces = cells[4];
              manifest.piecesHAWB = cells[20];
              manifest.bagNumber ='';
              manifest.totalBag ='';
              manifest.dimenssion ='';
              manifest.totalWeight ='';
              manifest.description =cells[24];
              manifest.documentBag ='';
              manifest.customBag ='';
              manifest.packagingType ='';
              manifest.packageType ='';
              manifest.validFalg ='';
              manifest.agentCopmany ='';
              manifest.agentName ='';
              manifest.agentEmail ='';
              manifest.agentAddress1 ='';
              manifest.agentAddress2 ='';
              manifest.agentAddress3 ='';
              manifest.agentCity ='';
              manifest.agentState ='';
              manifest.agentCountry ='';
              manifest.agentPostalcode ='';
              manifest.agentPhone ='';
              manifest.agentFax ='';
              manifest.agentContactPerson ='';
              manifest.agentMAWBNumber ='';
              manifest.mawbTemp='';
              manifest.customValue =cells[25];
              manifest.paidBy =cells[26];
              manifest.createdBy=req.user.firstName+ " " +req.user.lastName;
              manifest.createdDate=createdDate;


             }

                manifest.save(function (error, result) {
                  if (error) {
                      return next(new CustomError(error, 'Failure'));
                  }  

                /*  generateAirwaybillNumber().then(function (lmawb) {

                    result.lmawb = lmawb;

                    result.save(function (error, res) {

                    }); 

                  });*/
                  
                 // return res.status(201).json({});
                  });         
            i++;
          });

          if(data.length  == i)
          {
           return res.status(201).json({});;
          }
   
   /* await User.findOne({ _id: req.user._id }, (err, user) => {
        if (err) {
            return next(new CustomError(err, 'UserNotFound'));
        }
        if(user)
        {
            
        }
        else{
            return next(new CustomError(err, 'UserNotFound'));
        }
    });*/
  
     

}


exports.getAllManifest = async(req,res,next)=>
{  
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
  
      queryFilter["$or"] = [
        { "mawb" : { $regex: q, '$options': 'i' }}
      ];
      countFilter["$or"] = [
        { "mawb" : { $regex: q, '$options': 'i' }}
      ];
    }
    var query = {};
    if(pageNo < 0 || pageNo === 0) 
    {  
      return next(new CustomError(  "invalid page number, should start with 1", "PaginationError", 400));
    }
    query.skip  = size * (pageNo - 1);
    var sort = {};
    var group = {};
    query.limit = size;
    sort[sortColumn] = order;
    query.sort = sort;
    group["_id"] = "$mawb";
    query.group =group;

    Manifest.countDocuments(countFilter, function(err,totalCount) {
    Manifest.find(queryFilter,{}, query, function(err, shipments){

     /*  Manifest.aggregate([
       
        { $group: { _id: "$mawb" } },
        { "$sort": sort },
        { "$limit": size }
      ],
      function(err,shipments) {

   Manifest.aggregate(
      [
        {
          "$group": {
              "_id": "$mawb",
              entry: {
                $push: {
                  mawb: "$mawb",
                  type: "$type"
                }
              }
            
          }
      },
      { "$sort": sort },
      { "$limit": size }
      ],
      function(err,shipments) {*/

      if (err) 
      {
        return next(new CustomError(err));
      }
      var totalPages = Math.ceil(totalCount / size); 
      var hasMore = (totalCount > query.skip + size);
      var totalElements = Math.abs(hasMore == true? size : (totalCount - query.skip )); 
      response = {"data" : shipments, "totalPages": totalPages, "totalElements":totalElements,"totalRecords" : totalCount, "hasMore" : hasMore};
      return res.json(response).status(200);
      });
    })
       
} 



exports.getAllManifestFile = async(req,res,next)=>
{  
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
    var group = {};
    query.limit = size;
    sort[sortColumn] = order;
    query.sort = sort;
    ManifestFile.countDocuments(countFilter, function(err,totalCount) {
    ManifestFile.find(queryFilter,{}, query, function(err, result){

      if (err) 
      {
        return next(new CustomError(err));
      }
      var totalPages = Math.ceil(totalCount / size); 
      var hasMore = (totalCount > query.skip + size);
      var totalElements = Math.abs(hasMore == true? size : (totalCount - query.skip )); 
      response = {"data" : result, "totalPages": totalPages, "totalElements":totalElements,"totalRecords" : totalCount, "hasMore" : hasMore};
      return res.json(response).status(200);
      });
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

function csvToArray(csvString) {
  let ret = [''], i = 0, p = '', s = true;
  for (let l in csvString) {
      l = csvString[l];
      if ('"' === l) {
          s = !s;
          if ('"' === p) {
              ret[i] += '"';
              l = '-';
          } else if ('' === p)
              l = '-';
      } else if (s && ',' === l)
          l = ret[++i] = '';
      else
          ret[i] += l;
      p = l;
  }
  return ret;
}

exports.getManifestByID = async(req,res,next) => 
{
  if(!req.params.id) {
    return next(new CustomError(err));
  }
  await Manifest.findOne({ _id : req.params.id}, async (err,manifest) =>{
    if (err) 
        {
          return next(new CustomError(err));
        }  
    response = manifest;
    return res.json(response).status(200);
    })
 
}

exports.getManifestFileByID = async(req,res,next) => 
{
  if(!req.params.id) {
    return next(new CustomError(err));
  }
  await ManifestFile.findOne({ _id : req.params.id}, async (err,manifestFile) =>{
    if (err) 
        {
          return next(new CustomError(err));
        }  
    response = manifestFile;
    console.log(response);
    return res.json(response).status(200);
    })
 
}


exports.updateManifestFile = [

  check('departureDate', 'Departure Date is required').not().isEmpty(),
  
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
    await ManifestFile.findOne({ _id: req.params.id }, async (err, manifestFile) => {
    if (err) {
      return next(new CustomError(err, 'UnknownError'));

    }

        manifestFile.departureDate = req.body.departureDate;
        manifestFile.arrivalDate = req.body.arrivalDate;
        manifestFile.weight = req.body.weight;
        manifestFile.pieces = req.body.pieces;

        manifestFile.updatedBy = req.user.firstName+" "+req.user.lastName;
        manifestFile.updatedDate = updatedDate;

        manifestFile.save((error) => {
        if (error) { 
        return next(new CustomError(error, 'UnknownError'));
        }

     
      return res.status(201).json({});
    });
  
    });
  }  
];


async function generateAirwaybillNumber()
{
  let awbnum ="";
  await Manifest.findOne({}).sort({"lmawb":-1}).limit(1).then((data) => {
    
    if(data.lmawb == null)
    {
     awbnum="Penta-0001";

    }
    else
    {
    
    var airwaybill = data.lmawb;
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

  