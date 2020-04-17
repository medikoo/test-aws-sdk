"use strict";

require("../init");

const AWS      = require("aws-sdk")
    , template = require("./template2");

const cloudFormation = new AWS.CloudFormation({ region: process.env.AWS_REGION });

cloudFormation
	.createStack({ StackName: "permissions-error-test-2", TemplateBody: JSON.stringify(template) })
	.promise()
	.then(result => { console.log(result); });
