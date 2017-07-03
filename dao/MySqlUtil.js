var mysql = require('mysql');
var util = require('util');

var MySqlPool = function(dbConfig){
    var config = dbConfig;
    var pool;
    var poolName = dbConfig.dbName;

    this.setConfig = function(s) {
        config = s;
    }

    this.getConfig = function() {
        return config;
    }

    this.setPool = function(s) {
        pool = s;
    }

    this.getPool = function() {
        return pool;
    }

    this.getPoolName = function() {
        return poolName;
    }

    this.setPoolName = function(s) {
        poolName = s;
    }

}

//Create the pool
MySqlPool.prototype.createPool = function (callback) {
    var p = mysql.createPool(this.getConfig());
    this.setPool(p);
    callback( null, p );
};

//Terminate the pool
MySqlPool.prototype.terminatePool = function() {
    var obj = this;
    obj.getPool().terminate(function(err) {
        if(err){
            console.log("Error while terminating the pool"+err);
        }else{
            console.log("Pool terminated successfully");
        }
    });
};


MySqlPool.prototype.getPool = function() {
    return this.getPool();
};

MySqlPool.prototype.getPoolName = function() {
    return this.getPoolName();
};

//Get the connection - should not be called directly
MySqlPool.prototype.getConnection = function(callback) {
        this.getPool().getConnection(function(err, connection) {
        callback(err, connection);
    });
};

//Execute the query and return the results as array - should not be called directly
MySqlPool.prototype.execute = function(sql, bindParams, callback, options) {
   	 var obj = this;
    	console.log("Query to be executed - " + sql);
    	console.log("Bind params are - " + util.inspect(bindParams, showHidden=false, depth=20, colorize=true));
	this.getPool().query(sql, bindParams, function(error, results, fields){
		console.log("Error are : %j", error);
		console.log("Results are : %j", results);
		if(error) return callback(error, null, null);
		return callback(null, results, fields);
	});
};

//Release the connection - should not be called directly
MySqlPool.prototype.releaseConnection = function(connection) {
    connection.release(function(err) {
        if (err) {
            console.error("Error while releasing the connection");
        }else{
            console.log("Connection released successfully");
        }
    });
};

module.exports.MySqlPool = MySqlPool;
