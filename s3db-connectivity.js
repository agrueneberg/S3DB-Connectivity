/**
 * S3DB Connectivity is a browser module for interacting with S3DB, the Simple and Sloppy Semantic Database.
 * Namespace: s3dbc
 * Depends on: jQuery
 * Based on James Burke's Universal Module Definition (UMD) variation: https://gist.github.com/1262861
 */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
     // Use AMD.
        define(["jquery"], factory);
    } else {
     // Use browser globals.
        root.s3dbc = factory(root.jQuery);
    }
}(this, function ($) {
    var _deployment, _key, _userdata, _debug, _queryCounter, _publicAccess, _checkDeployment, _s3qlQuery, _sparqlQuery, _login, _apikeyCheck;
    _debug = false;
    _publicAccess = false;
    _queryCounter = 0;
    _checkDeployment = function (callback) {
        if (_deployment === undefined) {
            callback(new Error("Please provide the URL of the S3DB deployment via setDeployment."));
        } else {
            callback(null);
        }
    };
    _s3qlQuery = function (query, callback) {
        _checkDeployment(function (err) {
            if (err !== null) {
                callback(err);
            } else {
                var queryNumber, queryParams;
                if (_debug === true) {
                    _queryCounter++;
                    queryNumber = _queryCounter;
                    console.info("S3QL Query", queryNumber, ":", query);
                }
                queryParams = {
                    query: query,
                    format: "json"
                };
                if (_key !== undefined) {
                    queryParams.key = _key;
                }
                $.ajax({
                    url: _deployment + "S3QL.php",
                    data: queryParams,
                    dataType: "jsonp",
                    success: function (result) {
                        if (_debug === true) {
                            console.info("S3QL Query", queryNumber, "Result:", result);
                        }
                        // Error handling.
                        if (result.length === 0) {
                            // Empty result, call callback anyway.
                            callback(null, result);
                        } else {
                            if (result[0].error_code === undefined || result[0].error_code == "0") {
                                // No errors found, call callback.
                                callback(null, result);
                            } else {
                                callback(new Error(result[0].message));
                            }
                        }
                    }
                });
            }
        });
    };
    _sparqlQuery = function (query, fromCache, callback) {
        _checkDeployment(function (err) {
            if (err !== null) {
                callback(err);
            } else {
                var queryNumber, queryParams;
                if (_debug === true) {
                    _queryCounter++;
                    queryNumber = _queryCounter;
                    console.info("SPARQL Query", queryNumber, ":", query);
                }
                queryParams = {
                    query: query,
                    clean: fromCache,
                    format: "json"
                };
                if (_key !== undefined) {
                    queryParams.key = _key;
                }
                $.ajax({
                    url: _deployment + "sparql.php",
                    data: queryParams,
                    dataType: "jsonp",
                    success: function (result) {
                        if (_debug === true) {
                            console.info("SPARQL Query", queryNumber, "Result:", result);
                        }
                        // Error handling.
                        if (result.length === 0) {
                            // Empty result, call callback anyway.
                            callback(null, result);
                        } else {
                            if (result[0].error_code === undefined || result[0].error_code == "0") {
                                // No errors found, call callback.
                                callback(null, result);
                            } else {
                                callback(new Error(result[0].message));
                            }
                        }
                    }
                });
            }
        });
    };
    // @desc: login function that supports the two types of login (username or apikey)
    // @uses: login(username, password, callback)
    // @uses: login(apikey,callback)
    // @param: username - user's username
    // @param: password - user's password
    // @param: apikey - user's apikey
    // @param: callback - callback function to handle S3DB response
    _login = function () {
    	if(arguments.length == 3) {
    		var username, password, callback;
    		username = arguments[0];
    		password = arguments[1];
    		callback = arguments[2];
	        _checkDeployment(function (err) {
	            if (err !== null) {
	                callback(err);
	            } else {
	                $.ajax({
	                    url: _deployment + "apilogin.php",
	                    data: {
	                        username: username,
	                        password: password,
	                        format: "json"
	                    },
	                    dataType: "jsonp",
	                    success: function (result) {
	                        if (_debug === true) {
	                            console.info("Login Result: ", result);
	                        }
	                        // Error handling.
	                        if (result[0].error_code === undefined || result[0].error_code == "0") {
	                            _key = result[0].key_id;
	                            _apikeyCheck(callback);
	                        } else {
	                            callback(new Error(result[0].message));
	                        }
	                    },
	                    error: function (jqXHR, textStatus, errorThrown) {
	                    	callback(new Error(jqXHR.status + ': ' + errorThrown));
	                    }
	                });
	            }
	        });
    	} else if(arguments.length == 2) {
    		_key = arguments[0];
    		_apikeyCheck(arguments[1]);
    	} else {
    		callback(new Error("login: Invalid number of supplied arguments"));
    	}
    };
    // @desc: verifies the apikey
    // @param: callback - callback function to handle results
    _apikeyCheck = function(callback) {
        $.ajax({
            url: _deployment + "URI.php",
            data: {
                key: _key,
                format: "json"
            },
            dataType: "jsonp",
            success: function (result) {
                if (_debug === true) {
                    console.info("Login Result: ", result);
                }
                // Error handling.
                if (result[0].error_code === undefined || result[0].error_code == "0") {
                	if(result[0].account_lid !== undefined && result[0].account_lid.toLowerCase() == "public" && _publicAccess === false)  {
                		callback(new Error("Login Error - Invalid API Key, public access not allowed."));
                	} else {
                		result[0].apikey = _key;
                		callback(null, result[0]);
                	}
                } else {
                    callback(new Error(result[0].message));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            	callback(new Error(jqXHR.status + ': ' + errorThrown));
            }
        });
    };
    return {
        selectItem: function (itemId, callback) {
            _s3qlQuery("<S3QL>"
                + "<select>*</select>"
                + "<from>items</from>"
                + "<where>"
                + "<item_id>" + itemId + "</item_id>"
                + "</where>"
                + "</S3QL>",
                callback
            );
        },
        selectItemsByCollection: function (collectionId, callback) {
            _s3qlQuery("<S3QL>"
                + "<select>*</select>"
                + "<from>items</from>"
                + "<where>"
                + "<collection_id>" + collectionId + "</collection_id>"
                + "</where>"
                + "</S3QL>",
                callback
            );
        },
        insertItem: function (collectionId, notes, callback) {
            _s3qlQuery("<S3QL>"
                + "<insert>item</insert>"
                + "<where>"
                + "<collection_id>" + collectionId + "</collection_id>"
                + "<notes>" + notes + "</notes>"
                + "</where>"
                + "</S3QL>",
                callback
            );
        },
        updateItem: function (itemId, notes, callback) {
            _s3qlQuery("<S3QL>"
                + "<update>item</update>"
                + "<where>"
                + "<item_id>" + itemId + "</item_id>"
                + "<notes>" + notes + "</notes>"
                + "</where>"
                + "</S3QL>",
                callback
            );
        },
        deleteItem: function (itemId, callback) {
            _s3qlQuery("<S3QL>"
                + "<delete>item</delete>"
                + "<where>"
                + "<item_id>" + itemId + "</item_id>"
                + "</where>"
                + "<flag>all</flag>"
                + "</S3QL>",
                callback
            );
        },
        selectStatementsByRuleAndItem: function (ruleId, itemId, callback) {
            _s3qlQuery("<S3QL>"
                + "<select>*</select>"
                + "<from>statements</from>"
                + "<where>"
                + "<rule_id>" + ruleId + "</rule_id>"
                + "<item_id>" + itemId + "</item_id>"
                + "</where>"
                + "</S3QL>",
                callback
            );
        },
        selectStatementsByRuleAndValue: function (ruleId, value, callback) {
            _s3qlQuery("<S3QL>"
                + "<select>*</select>"
                + "<from>statements</from>"
                + "<where>"
                + "<rule_id>" + ruleId + "</rule_id>"
                + "<value>" + value + "</value>"
                + "</where>"
                + "</S3QL>",
                callback
            );
        },
        selectStatementsByRuleAndItemAndValue: function (ruleId, itemId, value, callback) {
            _s3qlQuery("<S3QL>"
                + "<select>*</select>"
                + "<from>statements</from>"
                + "<where>"
                + "<item_id>" + itemId + "</item_id>"
                + "<rule_id>" + ruleId + "</rule_id>"
                + "<value>" + value + "</value>"
                + "</where>"
                + "</S3QL>",
                callback
            );
        },
        insertStatement: function (itemId, ruleId, value, callback) {
            _s3qlQuery("<S3QL>"
                + "<insert>statement</insert>"
                + "<where>"
                + "<item_id>" + itemId + "</item_id>"
                + "<rule_id>" + ruleId + "</rule_id>"
                + "<value>" + value + "</value>"
                + "</where>"
                + "</S3QL>",
                callback
            );
        },
        updateStatement: function (statementId, value, callback) {
            _s3qlQuery("<S3QL>"
                + "<update>statement</update>"
                + "<where>"
                + "<statement_id>" + statementId + "</statement_id>"
                + "<value>" + value + "</value>"
                + "</where>"
                + "</S3QL>",
                callback
            );
        },
        deleteStatement: function (statementId, callback) {
            _s3qlQuery("<S3QL>"
                + "<delete>statement</delete>"
                + "<where>"
                + "<statement_id>" + statementId + "</statement_id>"
                + "</where>"
                + "</S3QL>",
                callback
            );
        },
        s3qlQuery: function (query, callback) {
            _s3qlQuery(query, callback);
        },
        sparqlQuery: function (query, callback) {
            _sparqlQuery(query, 1, callback);
        },
        cachedSparqlQuery: function (query, callback) {
            _sparqlQuery(query, 0, callback);
        },
        login: function () {
            _login.apply(this, arguments);
        },
        logout: function () {
            _key = undefined;
            _userdata = undefined;
        },
        allowPublic: function () {
        	_publicAccess = true;
        },
        setDeployment: function (deployment) {
            if (deployment[deployment.length - 1] !== "/") {
                deployment = deployment + "/";
            }
            _deployment = deployment;
        },
        setData: function (data) {
            _userdata = data;
        },
        setKey: function (key) {
            _key = key;
        },
        setDebug: function (debug) {
            _debug = debug;
        }
    };
}));
