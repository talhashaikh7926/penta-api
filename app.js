
const express = require('express');//Fast, unopinionated, minimalist web framework for node.
const cors = require('cors');//Node.js CORS middleware
const compression = require('compression');//Node.js compression middleware.

const mongoose = require('mongoose');//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
const bodyParser = require('body-parser');//Node.js body parsing middleware.Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const dotenv = require('dotenv');//Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.
const errorHandler = require('errorhandler');// custom error handler
const logger = require('morgan');// HTTP request logger middleware for node.js
const chalk = require('chalk'); //Terminal string styling done right
const passport = require('passport');// Passport is Express-compatible authentication middleware for Node.js
const auth = require('./service/auth');

var swaggerUi = require('swagger-ui-express'); // line 7
var swaggerJSDoc = require('swagger-jsdoc'); // line 8

const whitelist = ['http://localhost:4200', 
                   'https://localhost:4200'];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

dotenv.config();




/**
 * Create Express server.
 */
const app = express(),
      api = express.Router();
app.use(cors());

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
mongoose.set('debug', true);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(compression());
app.use(logger('dev'));
app.use(auth);

const routes      = require('./service/route');

app.use(routes);      // registering public routes

var options = { // line 27
  swaggerDefinition: {
    info: {
      title: 'Penta Logx', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'A sample API', // Description (optional)
    },
  },
  apis: ['./service/route.js' ], // Path to the API docs
};
var swaggerSpec = swaggerJSDoc(options); // line 36


app.get('/api-docs.json', function(req, res) { // line 41
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
 
// ...
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // line 45


app.get('/', function (req, res) {
  res.send('Hello World! Testing Application for node js');
});

app.get('/api', function (req, res) {
  res.send('Hello World! Testing Application for node js dsdsds');
});


/**
 * Error Handler.
 */
require('./service/error-handler').errorHandler(app);
app.use(errorHandler());
if (process.env.NODE_ENV === 'development') {
  // only use in development
  

  
} else {
  
  // app.use((err, req, res, next) => {    
  //   res.status(err.status || 500);
  // res.json({ error : err });
  // });
}

/**
 * Start Express server.
 */



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
