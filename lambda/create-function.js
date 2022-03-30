#!/usr/bin/env node

"use strict";

require("../init");

const path                     = require("path")
    , { Lambda }               = require("@aws-sdk/client-lambda")
    , resolveFunctionZipBuffer = require("./lib/resolve-function-zip-buffer");

const lambda = new Lambda({ region: process.env.AWS_REGION });

(async () => {
	console.log(
		await lambda.createFunction({
			Code: {
				ZipFile: await resolveFunctionZipBuffer(
					path.resolve(__dirname, "./functions", process.argv[2])
				)
			},
			FunctionName: process.argv[2],
			Handler: "index.handler",
			Role: process.env.AWS_IAM_ROLE,
			Runtime: "nodejs14.x"
		})
	);
})();
