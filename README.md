S3DB Connectivity
===============

S3DB Connectivity is a [RequireJS](http://requirejs.org/) module for interacting with [S3DB, the Simple and Sloppy Semantic Database](http://code.google.com/p/s3db/).

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

        // Config
        var deployment = '';
        var username = '';
        var password = '';
        var debug = false;

        // Setup
        s3dbConnectivity.setDeployment(deployment);
        s3dbConnectivity.setDebug(debug);
        s3dbConnectivity.login(username, password, function(err, key) {
            if (err !== null) {
                console.error(err);
            } else {
                s3dbConnectivity.setKey(key);
            }
        });

        // Retrieve data
        s3dbConnectivity.selectItemsByCollection('123', function(err, items) {
            if (err !== null) {
                console.error(err);
            } else {
                console.log(items);
            }
        });

    });
