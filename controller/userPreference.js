/*
* TowerLightTicket.js
*/
"use strict";

var async = require('async');
var exports = module.exports = {};
var mySqlQueryFactory = require(rootdir+'/dao/MySqlQueryFactory')
var appError     = require(rootdir+'/model/Error');

exports.getUserPreference = function ( req, res, next) {

    let errorArray = [];
    var query = mySqlQueryFactory.getQuery("getUserPreference");

    mySqlUtil.execute(query, [req.query.user, req.query.app], (queryError, results) => {

       if(queryError)
       {
            logger.error("mysql query returned an error. Error: ", queryError);
            errorArray.push(new appError("500", "Sever Error", "Error while getting user preference data "));
            return res.status(500).json(errorArray);
       }
       else
       {

         // the query is actually a stored procedure and the mysql query returns the results in a multi dimentional array. The first item contains the results of the query results[0] an the second
         // element results[1] actually contains the statistics associated with the sql operation.

         // note results[0][0].preferences is a json data type in the db... prior to returning it back to the caller we must
         // parse the data else it will be sent back with escape characters.

         // Our assumption is that just one row will be returned...

           if (results[0].length == 1)
           {
              results[0][0].preferences = JSON.parse(results[0][0].preferences)
              return res.status(200).send(results[0]);
           }
           else {
             return res.status(200).send({})
           }
        }
    });

};

exports.setUserPreference = function ( req, res, next) {

    var query = mySqlQueryFactory.getQuery("setUserPreference");

    mySqlUtil.execute(query, [req.body.user, req.body.app, req.body.preferences], (queryError, results) => {

       if(queryError)
       {
            logger.error("mysql query returned an error. Error: ", queryError);
            errorArray.push(new appError("500", "Sever Error", "Error while deleting query data "));
            return res.status(500).json(errorArray);
       }
       else
       {
            return res.status(200).json(results[1]);
        }
    });

};
