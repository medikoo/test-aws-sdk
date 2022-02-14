#!/usr/bin/env node

"use strict";

require("../../init");

const path                     = require("path")
    , { Lambda }               = require("@aws-sdk/client-lambda")
    , resolveFunctionZipBuffer = require("../../lambda/lib/resolve-function-zip-buffer")
    , config                   = require("./config");

const lambda = new Lambda({ region: process.env.AWS_REGION });

(async () => {
	const layerVersionArn = (
		await lambda.listLayerVersions({ LayerName: config.layerName })
	).LayerVersions.shift().LayerVersionArn;
	console.log(
		await lambda.createFunction({
			Code: {
				ZipFile: await resolveFunctionZipBuffer(
					path.resolve(__dirname, "functions", process.argv[2])
				)
			},
			FunctionName: `${ config.functionNamePrefix }-${ process.argv[2] }`,
			Handler: "index.handler",
			Role: process.env.AWS_IAM_ROLE,
			Runtime: "nodejs14.x",
			Environment: {
				Variables: {
					AWS_LAMBDA_EXEC_WRAPPER: "/opt/otel-extension/otel-handler",
					SLS_OTEL_REPORT_TYPE: "json",
					SLS_OTEL_REPORT_S3_BUCKET: "lambda-otel-extension-tests"
				}
			},
			Layers: layerVersionArn ? [layerVersionArn] : []
		})
	);
})();
