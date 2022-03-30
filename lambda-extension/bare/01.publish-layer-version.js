#!/usr/bin/env node

"use strict";

require("../../init");

const path                     = require("path")
    , { Lambda }               = require("@aws-sdk/client-lambda")
    , resolveFunctionZipBuffer = require("../../lambda/lib/resolve-function-zip-buffer")
    , config                   = require("./config");

const lambda = new Lambda({ region: process.env.AWS_REGION });

(async () => {
	console.log(
		await lambda.publishLayerVersion({
			LayerName: config.layerName,
			Content: { ZipFile: await resolveFunctionZipBuffer(path.resolve(__dirname, "./opt")) }
		})
	);
})();
