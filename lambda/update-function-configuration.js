#!/usr/bin/env node

"use strict";

require("../init");

const { Lambda } = require("@aws-sdk/client-lambda");

const lambda = new Lambda({ region: process.env.AWS_REGION });

(async () => {
	console.log(
		await lambda.updateFunctionConfiguration({
			FunctionName: process.argv[2],
			Timeout: 600,
			Runtime: "nodejs12.x"
		})
	);
})();
