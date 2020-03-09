const CustomError   = require('../models/customError.model');
function checkRole(allowed, permissions)
{
    if(permissions.findIndex(o => o.claimValue == allowed) >= 0)
    {
      return true;
    }
    return false;
  }

  module.exports = function userPermissions(perm, allPermission) 
  {
    if (checkRole(perm, allPermission))
      return true;
    else
      return false;       
  }
