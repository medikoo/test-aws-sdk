#!/usr/bin/env node

"use strict";

if (!process.argv[2]) throw new Error("Function name not provided");

require("../../init");

const { Lambda } = require("@aws-sdk/client-lambda")
    , config     = require("./config");

const lambda = new Lambda({ region: process.env.AWS_REGION });

(async () => {
	const result = await lambda.invoke({
		FunctionName: `${ config.functionNamePrefix }-${ process.argv[2] }`,
		Payload: Buffer.from(JSON.stringify({ foo: "bar" }), "utf8")
	});
	console.log(result);
	try {
		const payload = JSON.parse(Buffer.from(result.Payload));
		console.log(payload);
		console.log(JSON.parse(payload.body));
	} catch {}
})();
