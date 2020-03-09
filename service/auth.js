const passport      = require('passport');
const passportJWT   = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;
const UserModel     = require('../models/user.model');
const jwt           = require('jsonwebtoken');
const User = require('../models/user.model');
const CustomError = require('../models/customError.model');
const ExtractJWT    = passportJWT.ExtractJwt;
let IsAuthenticatedRequest = false;


var opts = {}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken('access_token');
opts.secretOrKey    = process.env.SECRET_KEY;
opts.issuer         = process.env.JWT_ISSUER;
opts.audience       = process.env.JWT_AUDIENCE;




passport.use('/connect/token',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async function (email, password, done) {

        try {
            //Find the user associated with the email provided by the user
            const user = await UserModel.findOne({ email });
            if( !user ){
              //If the user isn't found in the database, return a message
              return done(null, false, { message : 'User not found'});
            }
            //Validate password and make sure it matches with the corresponding hash stored in the database
            //If the passwords match, it returns a value of true.
            user.comparePassword(password, (err, isMatch) => {
              if (err) { return done(err); }
              if (isMatch) {
                return done(null, user);
              }
              return done(null, false, { msg: 'Invalid email or password.' });
            });
            //Send the user information to the next middleware
            return done(null, user, { message : 'Logged in Successfully'});
          } catch (error) {
            return done(error);
          }
    }
));


//This verifies that the token sent by the user is valid
module.exports = async function (req, res, next) {     
      // check header for the token
    var token = req.headers['authorization'];
         
    // decode token
    if (token) {
      var access_token = token.replace("Bearer ","");
      // verifies secret and checks if the token is expired
      try {
        await jwt.verify(access_token, process.env.SECRET_KEY,  (err, decoded) => {      
        if (err) {          
          if(err.name == 'TokenExpiredError'){
            next(new CustomError(err,'TokenExpiry'),401);
          }
          else {
            next(new CustomError(err,'InvalidToken'));
          }
        } else {
          // if everything is good, save to request for use in other routes
          //Pass the user details to the next middleware          
            IsAuthenticatedRequest =true;
            req.user = decoded.user;                         
        }
      });
    }
      catch (error) {      
        next(new CustomError(error,'InvalidToken'));
      }

    } else {
      // if there is no token  pass requst to middleware               
      IsAuthenticatedRequest = false     
    }           
   next();          
  };


  /**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401);
  //res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};