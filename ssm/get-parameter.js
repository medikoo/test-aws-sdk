"use strict";

require("../init");

const AWS = require("aws-sdk");

const ssm = new AWS.SSM({ region: process.env.AWS_REGION });

// const secretName = "/aws/reference/secretsmanager/someSecretAddress";

ssm.getParameter({ Name: "/aws/reference/secretsmanager/someSecretAddress", WithDecryption: true })
	.promise()
	.then(console.log);
