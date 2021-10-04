#!/usr/bin/env node

"use strict";

require("../init");

const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({ region: process.env.AWS_REGION });

lambda
	.invoke({ FunctionName: process.argv[2] })
	.promise()
	.then(result => {
		console.log(result);
		try {
			const payload = JSON.parse(result.Payload);
			console.log(payload);
			console.log(JSON.parse(payload.body));
		} catch {}
	});
