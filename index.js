// Initialize GLOBALS here
global.rootdir = __dirname; //ROOT level directory
global.config = require('config');
global.logger =  require(rootdir+'/util/LogUtil');

// Import required modules
var express  = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var winston = require('winston');
var _= require('lodash');
var routes = require(rootdir+'/routes/routes');
var app = express();

var mySqlDatabase = require(rootdir+'/dao/MySqlUtil').MySqlPool;
var async = require('async');


global.mySqlUtil = new mySqlDatabase(config["userPreferenceConfig"]);

//necessary for REST API
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended :  true}));
app.use(methodOverride('X-HTTP-Method-Override'));

//add CORS support
app.use(function(req,res,next){
	logger.debug(" Adding the CORS support inside the initializing funtion ");
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers','Content-Type, Authorization');
	next();
});

//Trigger manual GC every 3 hours - Apps running under PM2 issue
var runGC = function() {
    console.log ( "Enter - run GC  -- time -->" +  new Date().toString() );
    if (global.gc) {
        global.gc();
        console.log('After gc ');
    } else {
        console.log('Garbage collection unavailable.  use --expose-gc '
        + 'when launching node to enable forced garbage collection.');
    }
    console.log ( "Exit  - run GC  -- time -->" +  new Date().toString() );
}

var intVar = setInterval(runGC, config.app.gcInterval);

var router = app.use('/csi',  routes);

app.listen(config.app.port, function(){
    logger.info("");
    logger.info("--  :: " + new Date().toString());
    logger.info("-- Application (Dashboard Service) Started  --");
    logger.info("-- Environment (" + process.env.NODE_ENV + ")  --");
    logger.info("");
    logger.info("Database initialized and application started at port - "+ config.app.port);
});

mySqlUtil.createPool(function(err, pool){
        if(err){
            console.log("Error creating the pool" + err);
            console.log("Shutting down the service");
            process.exit(0);
        }else{
        }
});
