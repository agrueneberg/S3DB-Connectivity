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

        // Set deployment
        s3dbConnectivity.setDeployment(deployment);

        // Login first
        s3dbConnectivity.login(username, password, function(err, key) {
            if (err !== null) {
                console.error('Login failed.', err);
            } else {
                console.log('Login succeeded.');

                // Set key
                s3dbConnectivity.setKey(key);

                // Retrieve data
                s3dbConnectivity.selectItemsByCollection('123', function(err, items) {
                    if (err !== null) {
                        console.error('Retrieving items failed.', err);
                    } else {
                        console.log('Retrieving items succeeded.', items);
                    }
                });

            }
        });

    });
