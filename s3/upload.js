#!/usr/bin/env node

"use strict";

require("../init");

const fs  = require("fs")
    , AWS = require("aws-sdk");

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const tokens = process.argv[2].split("/");
const [bucket] = tokens, key = tokens.slice(1).join("/");

console.log(bucket, key);

const stream = fs.createReadStream(process.argv[3]);

stream.on("error", () => {});

setTimeout(() => {
	s3.upload({ Bucket: bucket, Key: key, Body: stream })
		.promise()
		.catch(error => { console.log("GOT ERROR", error.stack); });
}, 100);
