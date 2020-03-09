var  Country = require('./../models/country.model');
const CustomError = require('../models/customError.model');
var systemPermissions = require('../models/system-permissions.model');
const constants = require('../helpers/constants');
const { check,validationResult } = require('express-validator');//An express.js middleware for validator
var ObjectId = require('mongodb').ObjectID;


    exports.getAllCountry = async(req,res,next) => 
    {

        Country.find({}, (err, country) => {
            if (err) {
                return next(new CustomError(err, 'Failure'));
            }

            response = country;
            return res.json(response).status(200); 
        });


    }

    exports.getAllZones = async(req, res, next) => {
        
        Country.distinct( "zone" , function(err, zones) {
        if (err) {
    
            return next(new CustomError('Error occured while fetching role \r\n' + err));
        //   logger.error(new CustomError('Error occured while fetching role \r\n' + err));
        } 
        return res.json(zones).status(200); 
    });
    
    };
  
    exports.getAllcountryByZone = async(req, res, next) => {

        await Country.find({ zone: req.params.c} , function(err, country){
            if (err) 
            {
                  return next(new CustomError(err));
            }  
            response = country;
            return res.json(response).status(200);
            });
    
    };