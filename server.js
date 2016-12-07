// Get the packages we need
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var secrets = require('./config/secrets.js');
// For user authentication
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;
app.use(cookieParser());
app.use(session({ secret: 'passport' }));
app.use(passport.initialize());
app.use(passport.session());

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");


    next();

};
app.use(allowCrossDomain);
// Connect to mongodb
mongoose.connect(secrets.mongo_connection);
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


/**
 * Configure the passport instance by passing it to our passport module and as middleware to our express
 * app instance.
 */
require('./auth/passport')(passport);




// Use routes as a module (see index.js)
require('./routes')(app, router, passport);




// Start the server
app.listen(port);
console.log('Server running on port ' + port);

