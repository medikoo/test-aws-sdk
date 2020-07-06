#!/usr/bin/env node

"use strict";

require("../init");

const AWS                      = require("aws-sdk")
    , resolveFunctionZipBuffer = require("./lib/resolve-function-zip-buffer");

const lambda = new AWS.Lambda({ region: process.env.AWS_REGION });

(async () => {
	console.log(
		await lambda
			.createFunction({
				Code: { ZipFile: await resolveFunctionZipBuffer() },
				FunctionName: process.argv[2],
				Handler: "index.handler.other",
				Role: process.env.AWS_IAM_ROLE,
				Runtime: "nodejs12.x"
			})
			.promise()
	);
})();
