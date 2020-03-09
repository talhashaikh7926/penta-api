const Mailer = require('../service/mailer');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const ValidationErrors = require('../models/validationErrors.model');
const CustomError = require('../models/customError.model');
const { check,validationResult } = require('express-validator');//An express.js middleware for validator
//const helper = require('../helpers/helper');
//const uuidv1 = require('uuid/v1');
//var ObjectId = require('mongodb').ObjectID;
let agenda = require('../jobs/agenda');
const tokenList = {}
//const constants = require('../helpers/constants');



/**
 * @swagger
 * resourcePath: /api
 * description: All about API
 */

/**
 * @swagger
 * /login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */


/**
 * POST /Signup
 * Sign up using email and password.
 */
exports.register = [

    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password cannot be blank').not().isEmpty(),

    async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //return res.status(422).json({ errors: errors.array() });
      return next(new ValidationErrors(errors));
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password
    });
  
    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) { return next(err); }
      if (existingUser) {
        return next(new CustomError('Account with that email address already exists.', 'RegistrationFailure', 409));
      }
      user.save((err) => {
        if (err) { return next(err); }
      /*  req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          //login()
        });*/
        agenda.now('test-email', { fullName: fullName, email: "hira.shaikh@een.group", type: "Client" });
      });
    });
  
  }

];


  /**
 * POST /login
 * Sign in using email and password.
 */
exports.login = [  
  
  check('email', 'Email is not valid').isEmail(),
  check('password', 'Password cannot be blank').not().isEmpty(),
  check('grant_type', 'grant_type is required.').not().isEmpty(),// check grant_type in request.
  
  async (req, res, next) => {

  req.body.email = req.body.email.replace(' ', '+');
  
  const err =validationResult(req);
  if (!err.isEmpty()) {
    return next(new CustomError(err, 'GrantTypeRequired')); // if no grant_type is present in request then generate custom error and pass it middleware.
  }
  if (req.body.grant_type == "password" || req.body.grant_type == "refresh_token") { // grant_type only supported password or refresh_token
    //return next(new CustomError('Specified grant type is not supported.','InvalidGrantType'));          
    if (req.body.grant_type == 'password') {
  
      const errors =validationResult(req);

      if (!errors.isEmpty()) {
        return next(new CustomError(errors, 'ValidationFaild'));
      }
      try {
        const user = await User.findOne({ email: req.body.email }, async (err, result) => {

          if (err) {
            return next(new CustomError(err, 'ResourceNotFound'));
          }
          if (!result) {
            //If the user isn't found in the database, return a message
            return next(new CustomError('User not found', 'ResourceNotFound', 409));
          }
        /*  if(result.isEnabled==false){
            return next(new CustomError('User suspended', 'ResourceNotFound', 402));

          }*/
          //Validate password and make sure it matches with the corresponding hash stored in the database
          //If the passwords match, it returns a value of true. 
        /*  await result.comparePassword(req.body.password, async (err, isMatch) => {
            if (err) {
              return next(new CustomError(err, 'ValidationFaild'));
            }
            if (isMatch) 
            {*/
              await generateToken(result).then(function(tokenObject){ 
                
                res.json(tokenObject); 
                if(result.lastLogin == null)
                {
                  result.lastLogin = new Date();
                  result.save((err) => {
                    if (err) 
                    { 
                      return next(new CustomError(err)); 
                    }
                  });
                }

                



              });





         /*   }
            else {
              return next(new CustomError("Email or Password is invalid.", 'ValidationFaild'));
            }

          });*/
        });

      }
      catch (e) {
        return next(new CustomError(e, 'ValidationFaild'));
      }
    }
    else {
      jwt.verify(req.body.refresh_token, process.env.REFRESH_SECRET_KEY, async (err, r) => {
        if (err) {
          return next(new CustomError(err));
        }
        await User.findOne({ _id: r.sub }, async (err, result) => {
          if (err) {
            return next(new CustomError(err, 'ResourceNotFound', 409));
          }
          if (!result) {
            //If the user isn't found in the database, return a message
            return next(new CustomError('User not found', 'ResourceNotFound', 409));
          }
          await generateToken(result)
            .then(function (tokenObject) {
              res.json(tokenObject);
            });
        });

      })
    }
  }
}
];
async function generateToken(user) {


    const body =
    {
      sub: user._id,
      email: user.email,
     // fullName: user.fullName,
    // jobTitle: user.jobTitle,
    // phone: user.phoneNumber,
    
    };
    //Sign the JWT token and populate the payload with the user email and id
    const token = jwt.sign({ user: body }, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_LIFE });
    // Sign the JWT Refresh token
    const refreshToken = jwt.sign({ scope: 'access_token', sub: body.sub }, process.env.REFRESH_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_LIFE });

    const response = {
      "token_type": "Bearer",
      "access_token": token,
      "refresh_token": refreshToken,
      "expiresIn": process.env.TOKEN_LIFE,
      "id_token": Buffer.from(JSON.stringify(body)).toString('base64'),
      "last_login" : user.lastLogin
    }
    tokenList[refreshToken] = response;
    //Send back the token to the user
    return response;
  

}


exports.verifyToken = async (req, res, next) => {

  

  if (req.body.token) {

    password_reset_token = req.body.token;

    try {
      await jwt.verify(password_reset_token, process.env.SECRET_KEY, (err, decoded) => {


        if (err != null) {
          if (err.name == 'TokenExpiredError') {
            next(new CustomError(err, 'TokenExpiry'), 401);
          }
          else {
            next(new CustomError(err, 'InvalidToken'), 406); //406 => not acceptable
          }
        }
        else {

          console.log(decoded);

          var Email = decoded.email;
          var Id = decoded._id;
          var SecurityStamp = decoded.securityStamp;

         // , securityStamp: SecurityStamp
          User.findOne({ _id: Id, email: Email }, async (err, user) => {

            if (err) {
              next(new CustomError(err, 'Invalid Token'), 401);
            }

            if (!user) return next(new CustomError('Invalid Token'), 401);
          });
        }



      });
    } catch (error) {

      console.log('hira');
      next(new CustomError(error, 'InvalidToken'));
    }

  }
}

function isEmpty(obj) 
  {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }


  exports.checkapi = async (req, res, next) => {

    var fullName = ' Hira wasi ';
   
    agenda.now('test-email', { fullName: fullName, email: "hira.shaikh@een.group", type: "Client" });


    res.send('Hello World! Testing Application for node js dsdsds');
  }