#!/usr/bin/env node

"use strict";

require("../init");

const AWS = require("aws-sdk");

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const tokens = process.argv[2].split("/");
const [bucket] = tokens, key = tokens.slice(1).join("/");

console.log(bucket, key);

const body = Buffer.from(JSON.stringify({ foo: "bar" }));

setTimeout(() => {
	s3.putObject({ Bucket: bucket, Key: key, Body: body })
		.promise()
		.catch(error => { console.log("GOT ERROR", error.stack); });
}, 100);
