"use strict";

require("./init");

const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({ region: "us-east-1" });

lambda
	.invoke({ FunctionName: "plugin-test-0fa3-dev-sync" })
	.promise()
	.then(result => { console.log(result); });
