  // middleware for doing role-based permissions
const CustomError   = require('../models/customError.model');
module.exports =  function permit(...allowed) {
    const isAllowed = role => checkRole(allowed,role) // role => allowed.indexOf(role) > -1;
    
    // return a middleware
    return (request, response, next) => {
      if (request.user && isAllowed(request.user.permissions))
        next(); // role is allowed, so continue on the next middleware
      else {
        next(new CustomError('Forbidden request.' , 'Forbidden' ,403));        
      }
    }
  }
  function checkRole(allowed,userRoles){
    for(var i=0; i<userRoles.length; i++){
      if(allowed.indexOf(userRoles[i]) > -1 ){
      return true;
      }
    }
    return false;
  }