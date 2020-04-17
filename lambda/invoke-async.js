"use strict";

require("../init");

const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({ region: process.env.AWS_REGION });

lambda
	.invoke({ FunctionName: process.argv[2], InvocationType: "Event" })
	.promise()
	.then(result => { console.log(result); });
