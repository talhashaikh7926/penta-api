module.exports.errorHandler = function(app){

const { AssertionError } = require('assert');
const { MongoError }     = require('mongodb');
const ValidationErrors   = require('../models/validationErrors.model');
const CustomError        = require('./../models/customError.model');

app.use(function handleDatabaseError(error, req, res, next) {
  if (error instanceof CustomError) {
    return res.status(error.status).json({
      type: error.type,
      message: error.errors
    });
  }
  next(error);
});


app.use(function handleValidationError(error, req, res, next) {    
    if (error instanceof ValidationErrors) {
      return res.status(400).json({
        type: 'ValidationError',
        message: error.errors
      });
    }
    next(error);
  });

app.use(function handleAssertionError(error, req, res, next) {
  if (error instanceof AssertionError) {
    return res.status(400).json({
      type: 'AssertionError',
      message: error.message
    });
  }
  next(error);
});

app.use(function handleDatabaseError(error, req, res, next) {
  if (error instanceof MongoError) {
    return res.status(503).json({
      type: 'MongoError',
      message: error.message
    });
  }
  next(error);
});
 


app.use(function handleGeneralError(error, req, res, next) {
  if (error instanceof Error) {
    return res.status(400).json({
      type: 'SystemError',
      message: error.message
    });
  }
});

}