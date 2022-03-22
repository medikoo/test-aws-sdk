#!/usr/bin/env node

"use strict";

require("../../init");

const path       = require("path")
    , fsp        = require("fs").promises
    , { Lambda } = require("@aws-sdk/client-lambda")
    , config     = require("./config");

const lambda = new Lambda({ region: process.env.AWS_REGION });
const extensionFilename = path.resolve(__dirname, "extension.zip");

(async () => {
	console.log(
		await lambda.publishLayerVersion({
			LayerName: config.layerName,
			Content: { ZipFile: await fsp.readFile(extensionFilename) }
		})
	);
})();
