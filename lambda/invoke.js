#!/usr/bin/env node

"use strict";

require("../init");

const { Lambda } = require("@aws-sdk/client-lambda");

const lambda = new Lambda({ region: process.env.AWS_REGION });

(async () => {
	const result = await lambda.invoke({ FunctionName: process.argv[2] });
	console.log(result);
	try {
		const payload = JSON.parse(Buffer.from(result.Payload));
		console.log(payload);
		console.log(JSON.parse(payload.body));
	} catch {}
})();
