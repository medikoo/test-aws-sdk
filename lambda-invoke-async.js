"use strict";

require("./init");

const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({ region: "us-east-1" });

lambda
	.invoke({ FunctionName: "test-lambda-destinations-dev-function", InvocationType: "Event" })
	.promise()
	.then(result => { console.log(result); });
