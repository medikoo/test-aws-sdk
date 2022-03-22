#!/usr/bin/env node

"use strict";

require("../init");

const AWS = require("aws-sdk");

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const tokens = process.argv[2].split("/");
const [bucket] = tokens, prefix = tokens.slice(1).join("/");

console.log(bucket, prefix);
s3.listObjects({ Bucket: bucket, Prefix: prefix }).promise().then(console.log);
