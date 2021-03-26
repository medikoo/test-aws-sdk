#!/usr/bin/env node

"use strict";

require("../init");

const fs  = require("fs")
    , AWS = require("aws-sdk");

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const tokens = process.argv[2].split("/");
const [bucket] = tokens, key = tokens.slice(1).join("/");

console.log(bucket, key);
s3.getObject({ Bucket: bucket, Key: key })
	.createReadStream()
	.pipe(fs.createWriteStream(process.argv[3]));
