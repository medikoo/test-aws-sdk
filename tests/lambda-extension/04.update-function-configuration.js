#!/usr/bin/env node

"use strict";

require("../../init");

const { Lambda } = require("@aws-sdk/client-lambda")
    , config     = require("./config");

const lambda = new Lambda({ region: process.env.AWS_REGION });

(async () => {
	const layerVersionArn = (
		await lambda.listLayerVersions({ LayerName: config.layerName })
	).LayerVersions.shift().LayerVersionArn;
	console.log(
		await lambda.updateFunctionConfiguration({
			FunctionName: `${ config.functionNamePrefix }-${ process.argv[2] }`,
			Environment: {
				Variables: {
					// AWS_LAMBDA_EXEC_WRAPPER: "/var/task/internal-extension.sh"
				}
			},
			Layers: [layerVersionArn]
		})
	);
})();
