"use strict";

require("essentials");
process.env.AWS_PROFILE = "test";

const AWS = require("aws-sdk");

const ssm = new AWS.SSM({ region: "us-east-1" });

const secretName = "test-rds-secret";

ssm.getParameter({ Name: `/aws/reference/secretsmanager/${ secretName }`, WithDecryption: true })
	.promise()
	.then(console.log);
