S3DB Connectivity
===============

S3DB Connectivity is a browser module for interacting with [S3DB, the Simple and Sloppy Semantic Database](http://code.google.com/p/s3db/).


Features
--------

* Login
* [S3QL](http://s3ql.org/) queries
* Regular and cached SPARQL queries
* Custom error handler
* Debug mode
* [RequireJS](http://requirejs.org/) support


Usage
-----

    <!-- S3DB Connectivity depends on jQuery. -->
    <script src="s3db-connectivity.js"></script>
    <script>

        (function () {

            var deployment, username, password;

            deployment = "YOUR_DEPLOYMENT";
            username = "YOUR_USERNAME";
            password = "YOUR_PASSWORD";

         // First step: set S3DB deployment.
            s3dbc.setDeployment(deployment);

         // Second step: login.
            s3dbc.login(username, password, function(err, key) {
                if (err !== null) {
                    console.error("Login failed.", err);
                } else {
                    console.log("Login succeeded.");

                 // Third step: set key.
                    s3dbc.setKey(key);

                 // Fourth step: retrieve data.
                    s3dbc.selectItemsByCollection("123", function(err, items) {
                        if (err !== null) {
                            console.error("Retrieving items failed.", err);
                        } else {
                            console.log("Retrieving items succeeded.", items);
                        }
                    });

                }
            });

        });

    }());


Methods
-------

* `selectItem(itemId, callback)`
* `selectItemsByCollection(collectionId, callback)`
* `insertItem(collectionId, notes, callback)`
* `updateItem(itemId, notes, callback)`
* `deleteItem(itemId, callback)`
* `selectStatementsByRuleAndItem(ruleId, itemId, callback)`
* `selectStatementsByRuleAndValue(ruleId, value, callback)`
* `selectStatementsByRuleAndItemAndValue(ruleId, itemId, value, callback)`
* `insertStatement(itemId, ruleId, value, callback)`
* `updateStatement(statementId, value, callback)`
* `deleteStatement(statementId, callback)`
* `s3qlQuery(query, callback)`
* `sparqlQuery(query, callback)`
* `cachedSparqlQuery(query, callback)`
* `login(username, password, callback)`
* `logout()`
* `setDeployment(deployment)`
* `setKey(key)`
* `setDebug(debug)`
