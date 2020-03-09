const dotenv = require('dotenv');
const mongoose  = require('mongoose');
var User        = require('../models/user.model');
var Role        = require('../models/role.model');
var RoleClaim   = require('../models/roleClaim.model');
var UserRole    = require('../models/userRole.model');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
//dotenv.load({ path: '.env' });
dotenv.config();

// Claims
var claim = new RoleClaim({
claimType: "user.create",
claimValue: "user.create",
discriminator: "Full right claim for admin"
});

var claimUser = new RoleClaim({
    
    claimType: "User",
    claimValue: "User",
    discriminator: "Subset of Administrator "
    });

var claimOperation = new RoleClaim({        
        claimType: "Operation",
        claimValue: "Operation",
        discriminator: ""
        });

var claimEmployee = new RoleClaim({        
        claimType: "Employee",
        claimValue: "Employee",
        discriminator: ""
        });


    
// Roles
const role = new Role({    
    concurrencyStamp : + new Date(),    
    createdBy : "Administrator",
    createdDate: new Date(),    
    description: "Super Admin role can do anything.",        
    name: "Administrator",
    normalizedName:"ADMINISTRATOR",    
    updatedBy: null,
    updatedDate : null,
    roleClaims: [claim]
});

const roleEmployee = new Role({    
    concurrencyStamp : + new Date(),    
    createdBy : "Admin",
    createdDate: new Date(),    
    description: "Super Admin role can do anything.",        
    name: "Employee",
    normalizedName:"EMPLOYEE",    
    updatedBy: null,
    updatedDate : null,
    roleClaims: [claimEmployee,claimOperation]
});







// User
const user = new User({    
	
	createdBy: "Admin",
	createdDate:new Date(),
    email:"admin@eengroup.com",
    firstName : "Super",
    lastName :"Admin",
	isEnabled: true,
	jobTitle:"Super Admin",
	normalizedEmail: "admin@eengroup.com",
	normalizedUserName: "ADMIN@EENGROUP.COM",
	password: "Penta123@",
	phoneNumber: null,
	securityStamp:+ new Date(),
	twoFactorEnabled: false,
	updatedBy: null,
	updatedDate: null,
	userName: "admin@eengroup.com",

});



var done = 0;
mongoose.connect('mongodb://localhost:27017/pentalogx');
//mongoose.connect(process.env.MONGODB_URI);

role.save(function(err,result){
    
    console.log("Admin role created");
    if(err){
        console.log(err);
    }
    done++;    
    var userRole = new UserRole({            
        roleId  : role._id,        
        discriminator: "Assign admin role to admin user"
    });
    user.userRoles.push(userRole);
  
    user.save(function(err,result){
        console.log("Admin User  created");
        if(err){
            console.log(err);
        }
        done++;
        disconnectDB();
    });
    disconnectDB();
});
roleEmployee.save(function(err,result){
    console.log("Employee role created");
    if(err){
        console.log(err);
    }
    
    done++;
    disconnectDB();
});


roleEmployee.save(function(err,result){
    console.log("Employee role created");
    if(err){
        console.log(err);
    }
    
    done++;
    disconnectDB();
});



function disconnectDB(){

    if(done == 5){    
    console.log("mongoose is going to disconnect..");
    mongoose.disconnect();
    }
}