#!/usr/bin/env node

"use strict";

require("../init");

const AWS = require("aws-sdk");

const cloudwatchLogs = new AWS.CloudWatchLogs({ region: process.env.AWS_REGION });

cloudwatchLogs
	.filterLogEvents({ logGroupName: process.argv[2], startTime: Date.now() - 1000 * 60 })
	.promise()
	.then(result => { console.log("Events from last minute", result); });
