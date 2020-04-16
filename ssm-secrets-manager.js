"use strict";

require("./init");

const AWS = require("aws-sdk");

const ssm = new AWS.SSM({ region: process.env.AWS_REGION });

const secretName = "test-rds-secret";

ssm.getParameter({ Name: `/aws/reference/secretsmanager/${ secretName }`, WithDecryption: true })
	.promise()
	.then(console.log);
