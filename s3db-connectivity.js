/**
 * RequireJS Module: S3DB Connectivity
 * The first argument of each callback is reserved for an error object.
 */
define(function() {
    var _deployment;
    var _key;
    var _debug = false;
    var _queryCounter = 0;
    var _checkDeployment = function(callback) {
        if(_deployment === undefined) {
            callback(new Error('Please provide the URL of the S3DB deployment via setDeployment.'));
        }
    };
    var _checkKey = function(callback) {
        if(_key === undefined) {
            callback(new Error('Please provide an API key via setKey.'));
        }
    };
    var _s3qlQuery = function(query, callback) {
        _checkDeployment(callback);
        _checkKey(callback);
        var queryNumber;
        if(_debug === true) {
            _queryCounter++;
            queryNumber = _queryCounter;
            console.info('S3QL Query', queryNumber, ':', query);
        }
        $.ajax({
            url: _deployment + 'S3QL.php',
            data: {
                query: query,
                key: _key,
                format: 'json'
            },
            dataType: 'jsonp',
            success: function(result) {
                if(_debug === true) {
                    console.info('S3QL Query', queryNumber, 'Result:', result);
                }
                // Error handling.
                if(result.length === 0) {
                    // Empty result, call callback anyway.
                    callback(null, result);
                } else {
                    if(result[0].error_code === undefined || result[0].error_code == '0') {
                        // No errors found, call callback.
                        callback(null, result);
                    } else {
                        callback(new Error(result[0].message));
                    }
                }
            }
        });
    };
    var _sparqlQuery = function(query, fromCache, callback) {
        _checkDeployment(callback);
        _checkKey(callback);
        var queryNumber;
        if(_debug === true) {
            _queryCounter++;
            queryNumber = _queryCounter;
            console.info('SPARQL Query', queryNumber, ':', query);
        }
        $.ajax({
            url: _deployment + 'sparql.php',
            data: {
                query: query,
                key: _key,
                clean: fromCache,
                format: 'json'
            },
            dataType: 'jsonp',
            success: function(result) {
                if(_debug === true) {
                    console.info('SPARQL Query', queryNumber, 'Result:', result);
                }
                // Error handling.
                if(result.length === 0) {
                    // Empty result, call callback anyway.
                    callback(null, result);
                } else {
                    if(result[0].error_code === undefined || result[0].error_code == '0') {
                        // No errors found, call callback.
                        callback(null, result);
                    } else {
                        callback(new Error(result[0].message));
                    }
                }
            }
        });
    };
    var _login = function(username, password, callback) {
        _checkDeployment(callback);
        $.ajax({
            url: _deployment + 'apilogin.php',
            data: {
                username: username,
                password: password,
                format: 'json'
            },
            dataType: 'jsonp',
            success: function(result) {
                if(_debug === true) {
                    console.info('Login Result: ', result);
                }
                // Error handling.
                if(result[0].error_code === undefined || result[0].error_code == '0') {
                    _key = result[0].key_id;
                    callback(null, _key);
                } else {
                    callback(new Error(result[0].message));
                }
            }
        });
    };
    return {
        selectItem: function(itemId, callback) {
            _s3qlQuery('<S3QL>'
                + '<select>*</select>'
                + '<from>items</from>'
                + '<where>'
                + '<item_id>' + itemId + '</item_id>'
                + '</where>'
                + '</S3QL>',
                callback
            );
        },
        selectItemsByCollection: function(collectionId, callback) {
            _s3qlQuery('<S3QL>'
                + '<select>*</select>'
                + '<from>items</from>'
                + '<where>'
                + '<collection_id>' + collectionId + '</collection_id>'
                + '</where>'
                + '</S3QL>',
                callback
            );
        },
        insertItem: function(collectionId, notes, callback) {
            _s3qlQuery('<S3QL>'
                + '<insert>item</insert>'
                + '<where>'
                + '<collection_id>' + collectionId + '</collection_id>'
                + '<notes>' + notes + '</notes>'
                + '</where>'
                + '</S3QL>',
                callback
            );
        },
        updateItem: function(itemId, notes, callback) {
            _s3qlQuery('<S3QL>'
                + '<update>item</update>'
                + '<where>'
                + '<item_id>' + itemId + '</item_id>'
                + '<notes>' + notes + '</notes>'
                + '</where>'
                + '</S3QL>',
                callback
            );
        },
        deleteItem: function(itemId, callback) {
            _s3qlQuery('<S3QL>'
                + '<delete>item</delete>'
                + '<where>'
                + '<item_id>' + itemId + '</item_id>'
                + '</where>'
                + '<flag>all</flag>'
                + '</S3QL>',
                callback
            );
        },
        selectStatementsByRuleAndItem: function(ruleId, itemId, callback) {
            _s3qlQuery('<S3QL>'
                + '<select>*</select>'
                + '<from>statements</from>'
                + '<where>'
                + '<rule_id>' + ruleId + '</rule_id>'
                + '<item_id>' + itemId + '</item_id>'
                + '</where>'
                + '</S3QL>',
                callback
            );
        },
        selectStatementsByRuleAndValue: function(ruleId, value, callback) {
            _s3qlQuery('<S3QL>'
                + '<select>*</select>'
                + '<from>statements</from>'
                + '<where>'
                + '<rule_id>' + ruleId + '</rule_id>'
                + '<value>' + value + '</value>'
                + '</where>'
                + '</S3QL>',
                callback
            );
        },
        selectStatementsByRuleAndItemAndValue: function(ruleId, itemId, value, callback) {
            _s3qlQuery('<S3QL>'
                + '<select>*</select>'
                + '<from>statements</from>'
                + '<where>'
                + '<item_id>' + itemId + '</item_id>'
                + '<rule_id>' + ruleId + '</rule_id>'
                + '<value>' + value + '</value>'
                + '</where>'
                + '</S3QL>',
                callback
            );
        },
        insertStatement: function(itemId, ruleId, value, callback) {
            _s3qlQuery('<S3QL>'
                + '<insert>statement</insert>'
                + '<where>'
                + '<item_id>' + itemId + '</item_id>'
                + '<rule_id>' + ruleId + '</rule_id>'
                + '<value>' + value + '</value>'
                + '</where>'
                + '</S3QL>',
                callback
            );
        },
        updateStatement: function(statementId, value, callback) {
            _s3qlQuery('<S3QL>'
                + '<update>statement</update>'
                + '<where>'
                + '<statement_id>' + statementId + '</statement_id>'
                + '<value>' + value + '</value>'
                + '</where>'
                + '</S3QL>',
                callback
            );
        },
        deleteStatement: function(statementId, callback) {
            _s3qlQuery('<S3QL>'
                + '<delete>statement</delete>'
                + '<where>'
                + '<statement_id>' + statementId + '</statement_id>'
                + '</where>'
                + '</S3QL>',
                callback
            );
        },
        s3qlQuery: function(query, callback) {
            _s3qlQuery(query, callback);
        },
        sparqlQuery: function(query, callback) {
            _sparqlQuery(query, 1, callback);
        },
        cachedSparqlQuery: function(query, callback) {
            _sparqlQuery(query, 0, callback);
        },
        login: function(username, password, callback) {
            _login(username, password, callback);
        },
        logout: function() {
            _key = undefined;
        },
        setDeployment: function(deployment) {
            _deployment = deployment;
        },
        setKey: function(key) {
            _key = key;
        },
        setDebug: function(debug) {
            _debug = debug;
        }
    };
});
