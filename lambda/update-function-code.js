"use strict";

require("../init");

const AWS                      = require("aws-sdk")
    , resolveFunctionZipBuffer = require("./lib/resolve-function-zip-buffer");

const lambda = new AWS.Lambda({ region: process.env.AWS_REGION });

(async () => {
	console.log(
		await lambda
			.updateFunctionCode({
				FunctionName: process.argv[2],
				ZipFile: await resolveFunctionZipBuffer()
			})
			.promise()
	);
})();
