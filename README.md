S3DB Connectivity
===============

S3DB Connectivity is a browser module for interacting with [S3DB, the Simple and Sloppy Semantic Database](http://s3db.org).


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

### Public project (no login required)

    <!-- S3DB Connectivity depends on jQuery. -->
    <script src="jquery.js"></script>
    <script src="s3db-connectivity.js"></script>
    <script>

        (function () {
            "use strict";

            var deployment;

            deployment = "YOUR_DEPLOYMENT";

         // First step: set S3DB deployment.
            s3dbc.setDeployment(deployment);

         // Second step: retrieve data.
            s3dbc.selectItemsByCollection("YOUR_COLLECTION_ID", function (err, items) {
                if (err !== null) {
                    console.error("Retrieving items failed.", err);
                } else {
                    console.log("Retrieving items succeeded.", items);
                }
            });

        }());

    </script>

### Private project (login required - username)

    <!-- S3DB Connectivity depends on jQuery. -->
    <script src="jquery.js"></script>
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
            s3dbc.login(username, password, function (err, data) {
                if (err !== null) {
                    console.error("Login failed.", err);
                } else {
                    console.log("Login succeeded.");

                 // Third step: set user data.
                    s3dbc.setData(data);

                 // Fourth step: retrieve data.
                    s3dbc.selectItemsByCollection("YOUR_COLLECTION_ID", function (err, items) {
                        if (err !== null) {
                            console.error("Retrieving items failed.", err);
                        } else {
                            console.log("Retrieving items succeeded.", items);
                        }
                    });

                }
            });

        }());

    </script>

### Private project (login required - apikey)

    <!-- S3DB Connectivity depends on jQuery. -->
    <script src="jquery.js"></script>
    <script src="s3db-connectivity.js"></script>
    <script>

        (function () {

            var deployment, apikey;

            deployment = "YOUR_DEPLOYMENT";
            apikey = "YOUR_APIKEY";

         // First step: set S3DB deployment.
            s3dbc.setDeployment(deployment);

         // Second step [Optional]: determine if you will allow public access anyway if the connection is successful.
            s3dbc.allowPublic();

         // Third step: login.
            s3dbc.login(apikey, function (err, data) {
                if (err !== null) {
                    console.error("Login failed.", err);
                } else {
                    console.log("Login succeeded.");

                 // Fourth step: set user data.
                    s3dbc.setData(data);

                 // Fifth step: retrieve data.
                    s3dbc.selectItemsByCollection("YOUR_COLLECTION_ID", function (err, items) {
                        if (err !== null) {
                            console.error("Retrieving items failed.", err);
                        } else {
                            console.log("Retrieving items succeeded.", items);
                        }
                    });
                }
            });

        }());

    </script>


Methods
-------

The first argument of a callback function is reserved for an error object, a useful convention to allow error catching in asynchronous programming. If an error object is `null` no error occurred.

### Init

* `setDeployment(string deployment)`
* `setKey(string key)`
* `setDebug(boolean debug)` Enable or disable debug mode (default: false)

### Login & Logout

* `login(string username, string password, (err, object userdata) callback)`
* `login(string apikey, (err, object userdata) callback)`
* `logout()`

### Items

* `selectItem(string itemId, (err, array results) callback)`
* `selectItemsByCollection(string collectionId, (err, array results) callback)`
* `insertItem(string collectionId, string notes, (err, array results) callback)`
* `updateItem(string itemId, string notes, (err, array results) callback)`
* `deleteItem(string itemId, (err, array results) callback)`

### Statements

* `selectStatementsByRuleAndItem(string ruleId, string itemId, (err, array results) callback)`
* `selectStatementsByRuleAndValue(string ruleId, string value, (err, array results) callback)`
* `selectStatementsByRuleAndItemAndValue(string ruleId, string itemId, string value, (err, array results) callback)`
* `insertStatement(string itemId, string ruleId, string value, (err, array results) callback)`
* `updateStatement(string statementId, string value, (err, array results) callback)`
* `deleteStatement(string statementId, (err, array results) callback)`

### Raw S3QL

* `s3qlQuery(string query, (err, array results) callback)`

### SPARQL

* `sparqlQuery(string query, (err, array results) callback)`
* `cachedSparqlQuery(string query, (err, array results) callback)`
