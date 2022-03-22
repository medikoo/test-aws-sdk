#!/usr/bin/env node

"use strict";

require("../init");

const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({ region: process.env.AWS_REGION });

(async () => {
	console.log(await lambda.listLayerVersions({ LayerName: process.argv[2] }).promise());
})();
