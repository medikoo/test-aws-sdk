#!/usr/bin/env node

"use strict";

require("../init");

const path                     = require("path")
    , AWS                      = require("aws-sdk")
    , resolveFunctionZipBuffer = require("./lib/resolve-function-zip-buffer");

const lambda = new AWS.Lambda({ region: process.env.AWS_REGION });

(async () => {
	console.log(
		await lambda
			.updateFunctionCode({
				FunctionName: process.argv[2],
				ZipFile: await resolveFunctionZipBuffer(path.resolve(__dirname, "./function"))
			})
			.promise()
	);
})();
