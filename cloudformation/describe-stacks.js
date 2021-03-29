"use strict";

require("../init");

const AWS = require("aws-sdk");

const cloudFormation = new AWS.CloudFormation({ region: process.env.AWS_REGION });

cloudFormation
	.describeStacks({ StackName: process.argv[2] })
	.promise()
	.then(result => { console.log(result); });
