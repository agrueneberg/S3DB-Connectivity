S3DB Connectity
===============

S3DB Connectity is a [RequireJS](http://requirejs.org/) module for interacting with [S3DB, the Simple and Sloppy Semantic Database](http://code.google.com/p/s3db/).

Features
--------

* Login
* S3QL queries
* Regular and cached SPARQL queries
* Custom error handler
* Debug mode

Usage
-----

    require(['s3db-connectivity'], function(s3dbConnectivity) {

        var deployment = '';
        var username = '';
        var password = '';
        var errorHandler = function(msg) {
            console.error(msg);
        };
        var debug = false;

        // Setup
        s3dbConnectivity.setDeployment(deployment);
        s3dbConnectivity.setOnError(errorHandler);
        s3dbConnectivity.setDebug(debug);
        s3dbConnectivity.login(username, password, function(key) {
            s3dbConnectivity.setKey(key);
        });

        // Retrieve data
        s3dbConnectivity.selectItemsByCollection('123', function(items) {
            console.log(items);
        });

    });
