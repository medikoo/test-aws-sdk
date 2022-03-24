"use strict";

require("essentials");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("log-node")();

if (!process.env.AWS_REGION) process.env.AWS_REGION = "us-east-1";
