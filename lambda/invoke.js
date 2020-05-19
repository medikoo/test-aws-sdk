"use strict";

require("../init");

const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({ region: process.env.AWS_REGION });

lambda.invoke({ LogType: "Tail", FunctionName: process.argv[2] }).promise().then(result => {
	console.log(result);
	console.log(Buffer.from(result.LogResult, "base64").toString());
});
